#!/usr/bin/env node
/**
 * Production script to update FEEL built-in functions from Apache KIE Drools source
 *
 * Usage: pnpm update-builtins
 *
 * This script:
 * 1. Fetches latest documentation from Apache KIE Drools GitHub
 * 2. Parses all function definitions from AsciiDoc
 * 3. Generates TypeScript metadata
 * 4. Writes to packages/core/src/builtins.ts (replacing existing)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_URL = 'https://raw.githubusercontent.com/apache/incubator-kie-drools/main/kie-dmn/kie-dmn-feel/ref-dmn-feel-builtin-functions.adoc';
const OUTPUT_PATH = path.join(__dirname, '..', 'packages', 'core', 'src', 'builtins.ts');

interface ParsedFunction {
  name: string;
  signatures: string[];
  description: string;
  category: string;
  parameters: Array<{
    name: string;
    type: string;
    optional?: boolean;
    description: string;
  }>;
  returnType: string;
  examples: string[];
}

/**
 * Fetch content from URL
 */
function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse AsciiDoc content to extract function definitions
 */
function parseAsciiDoc(content: string): ParsedFunction[] {
  const functions: ParsedFunction[] = [];
  const sections = content.split('// ----------------------------------------------------------------------------');
  let currentCategory = '';

  for (const section of sections) {
    // Extract category
    const categoryMatch = section.match(/^== (.+)$/m);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Extract function definition
    const functionMatch = section.match(/^([a-z ]+)\(([^)]*)\)/m);
    if (!functionMatch) continue;

    const functionName = functionMatch[1].trim();
    const paramsString = functionMatch[2].trim();

    // Extract description
    const descMatch = section.match(/--\n(.+?)(?:\n\.Parameters|\n\.Example|\n\.Signature)/s);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract parameters from table
    const parameters: ParsedFunction['parameters'] = [];
    const paramTableMatch = section.match(/\.Parameters\n\[cols[^\]]+\]\n\|===\n(.*?)\n\|===/s);

    if (paramTableMatch) {
      const tableContent = paramTableMatch[1];
      const rows = tableContent.split('\n\n').filter(r => r.trim());

      const dataRows = rows.filter(row =>
        !row.includes('|Parameter') &&
        !row.includes('|Type') &&
        row.includes('|')
      );

      for (const row of dataRows) {
        const cells = row.split('\n').map(line => line.replace(/^\|/, '').trim()).filter(c => c);

        if (cells.length >= 2) {
          const paramName = cells[0].replace(/`/g, '').trim();
          const paramType = cells[1].replace(/`/g, '').trim();
          const paramDesc = cells[2]?.replace(/`/g, '').trim() || '';

          parameters.push({
            name: paramName,
            type: paramType,
            optional: paramName.includes('(Optional)') || paramDesc.includes('Optional') || paramsString.includes('?'),
            description: paramDesc || `${paramName} parameter`,
          });
        }
      }
    }

    // Fallback: extract from function signature if no table
    if (parameters.length === 0 && paramsString) {
      const params = paramsString.split(',').map(p => p.trim()).filter(p => p);
      for (const param of params) {
        const parts = param.split(':').map(p => p.trim());
        if (parts.length >= 1) {
          const name = parts[0].replace('?', '').trim();
          const type = parts[1] || 'any';
          parameters.push({
            name,
            type,
            optional: param.includes('?'),
            description: `${name} parameter`,
          });
        }
      }
    }

    // Extract return type
    const returnMatch = section.match(/Returns? (?:an? )?`([^`]+)`/);
    const returnType = returnMatch ? returnMatch[1] : 'any';

    // Extract examples
    const examples: string[] = [];
    const exampleMatches = section.matchAll(/\[source,FEEL\]\n----\n([^-]+)----/g);
    for (const match of exampleMatches) {
      examples.push(match[1].trim());
    }

    // Extract alternative signatures
    const signatures = [functionName + '(' + paramsString + ')'];
    const altSigMatch = section.match(/\.Alternative signature[s]?\n----\n(.+?)\n----/s);
    if (altSigMatch) {
      const altSigs = altSigMatch[1].split('\n').map(s => s.trim()).filter(s => s);
      signatures.push(...altSigs);
    }

    if (functionName && currentCategory) {
      functions.push({
        name: functionName,
        signatures,
        description,
        category: currentCategory,
        parameters,
        returnType,
        examples,
      });
    }
  }

  return functions;
}

/**
 * Escape string for TypeScript, handling newlines and quotes
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate TypeScript code for a single function
 */
function generateFunctionCode(fn: ParsedFunction): string {
  // Build signature from name and parameters
  const paramParts = fn.parameters.map(p => {
    const optional = p.optional ? '?' : '';
    return `${p.name}${optional}: ${p.type}`;
  });
  const signature = `${fn.name}(${paramParts.join(', ')}): ${fn.returnType}`;

  const params = fn.parameters.map(p => {
    const optionalField = p.optional ? `        optional: true,\n` : '';
    return `      {
        name: '${escapeString(p.name)}',
        type: '${escapeString(p.type)}',
${optionalField}        description: '${escapeString(p.description)}',
      }`;
  }).join(',\n');

  return `  {
    name: '${escapeString(fn.name)}',
    signature: '${escapeString(signature)}',
    description: '${escapeString(fn.description)}',
    parameters: [
${params}
    ],
    returnType: '${escapeString(fn.returnType)}',
  }`;
}

/**
 * Generate complete builtins.ts file content
 */
function generateOutputFile(functions: ParsedFunction[]): string {
  // Group by category
  const byCategory = functions.reduce((acc, fn) => {
    if (!acc[fn.category]) acc[fn.category] = [];
    acc[fn.category].push(fn);
    return acc;
  }, {} as Record<string, ParsedFunction[]>);

  // Generate header
  let output = `import { BuiltInFunction } from './types.js';

/**
 * FEEL Built-in Functions Metadata
 *
 * ⚠️  AUTO-GENERATED - DO NOT EDIT MANUALLY
 *
 * This file is automatically generated from the Apache KIE Drools FEEL specification.
 * Source: ${SOURCE_URL}
 *
 * To update: run \`pnpm update-builtins\`
 *
 * Last updated: ${new Date().toISOString()}
 *
 * Based on:
 * - DMN 1.3 specification
 * - Apache KIE Drools implementation
 *
 * Note: While the \`feelin\` library contains the actual built-in function
 * implementations, it does not export metadata with descriptions suitable
 * for LSP hover information. This file provides rich documentation for
 * each built-in function to enhance the developer experience.
 */

export const builtInFunctions: BuiltInFunction[] = [
`;

  // Add functions by category
  const categoryEntries = Object.entries(byCategory);
  categoryEntries.forEach(([category, fns], catIdx) => {
    output += `\n  // ========================================\n`;
    output += `  // ${category}\n`;
    output += `  // ========================================\n\n`;

    fns.forEach((fn, fnIdx) => {
      output += generateFunctionCode(fn);

      // Add comma if not the last function
      const isLastInCategory = fnIdx === fns.length - 1;
      const isLastCategory = catIdx === categoryEntries.length - 1;
      if (!isLastInCategory || !isLastCategory) {
        output += ',\n';
      }
    });
  });

  // Add helper functions
  output += `
];

/**
 * Get function information by name (returns first match)
 */
export function getBuiltInFunction(name: string): BuiltInFunction | undefined {
  return builtInFunctions.find((fn) => fn.name === name);
}

/**
 * Get all overloads for a function name
 */
export function getBuiltInFunctionOverloads(name: string): BuiltInFunction[] {
  return builtInFunctions.filter((fn) => fn.name === name);
}

/**
 * Get all unique function names (for completion)
 */
export function getBuiltInFunctionNames(): string[] {
  return Array.from(new Set(builtInFunctions.map((fn) => fn.name)));
}
`;

  return output;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Updating FEEL built-in functions...\n');

  try {
    // Step 1: Fetch documentation
    console.log('📥 Fetching Apache KIE Drools documentation...');
    const content = await fetchUrl(SOURCE_URL);
    console.log('✅ Downloaded successfully\n');

    // Step 2: Parse functions
    console.log('📝 Parsing function definitions...');
    const functions = parseAsciiDoc(content);
    const uniqueNames = new Set(functions.map(f => f.name));
    console.log(`✅ Parsed ${functions.length} function signatures (${uniqueNames.size} unique names)\n`);

    // Step 3: Group by category for summary
    const byCategory = functions.reduce((acc, fn) => {
      acc[fn.category] = (acc[fn.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 Functions by category:');
    Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   - ${category}: ${count}`);
      });
    console.log();

    // Step 4: Generate TypeScript code
    console.log('🔨 Generating TypeScript code...');
    const outputContent = generateOutputFile(functions);
    console.log('✅ Code generated\n');

    // Step 5: Write to file
    console.log(`💾 Writing to ${path.relative(process.cwd(), OUTPUT_PATH)}...`);
    fs.writeFileSync(OUTPUT_PATH, outputContent);
    console.log('✅ File written successfully\n');

    // Step 6: Verify TypeScript compilation
    console.log('🔍 Verifying TypeScript syntax...');
    const { execSync } = await import('child_process');
    try {
      execSync(`npx tsc --noEmit ${OUTPUT_PATH}`, { stdio: 'pipe' });
      console.log('✅ TypeScript compilation successful\n');
    } catch (error) {
      console.error('❌ TypeScript compilation failed:');
      console.error((error as any).stderr.toString());
      process.exit(1);
    }

    // Success summary
    console.log('🎉 Built-in functions updated successfully!\n');
    console.log('Summary:');
    console.log(`   - Total functions: ${functions.length}`);
    console.log(`   - Unique names: ${uniqueNames.size}`);
    console.log(`   - Categories: ${Object.keys(byCategory).length}`);
    console.log(`   - Output: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
    console.log('\n✨ Done! You can now rebuild the project with `pnpm build`\n');

  } catch (error) {
    console.error('\n❌ Error updating built-in functions:');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
