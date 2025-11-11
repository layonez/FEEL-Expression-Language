package com.feel.plugin

import com.intellij.lang.ASTNode
import com.intellij.lang.ParserDefinition
import com.intellij.lang.PsiParser
import com.intellij.lexer.Lexer
import com.intellij.openapi.project.Project
import com.intellij.psi.FileViewProvider
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import com.intellij.psi.tree.IElementType
import com.intellij.psi.tree.IFileElementType
import com.intellij.psi.tree.TokenSet

/**
 * Parser definition for FEEL language.
 * Provides basic lexical structure for IntelliJ PSI tree.
 * LSP handles semantic analysis and advanced features.
 */
class FeelParserDefinition : ParserDefinition {
    override fun createLexer(project: Project?): Lexer = FeelLexer()

    override fun createParser(project: Project?): PsiParser = FeelParser()

    override fun getFileNodeType(): IFileElementType = FILE

    override fun getCommentTokens(): TokenSet = FeelTypes.COMMENTS

    override fun getStringLiteralElements(): TokenSet = FeelTypes.STRINGS

    override fun createElement(node: ASTNode?): PsiElement = FeelPsiElement(node!!)

    override fun createFile(viewProvider: FileViewProvider): PsiFile = FeelFile(viewProvider)

    companion object {
        val FILE = IFileElementType(FeelLanguage)
    }
}

/**
 * Basic lexer for FEEL language.
 * Provides minimal tokenization for syntax highlighting.
 * LSP server handles semantic analysis.
 */
class FeelLexer : Lexer() {
    private var buffer: CharSequence = ""
    private var startOffset = 0
    private var endOffset = 0
    private var bufferEnd = 0
    private var state = 0
    private var tokenType: IElementType? = null

    override fun start(buffer: CharSequence, startOffset: Int, endOffset: Int, initialState: Int) {
        this.buffer = buffer
        this.startOffset = startOffset
        this.endOffset = startOffset
        this.bufferEnd = endOffset
        this.state = initialState
        this.tokenType = null
        advance()
    }

    override fun getState(): Int = state

    override fun getTokenType(): IElementType? = tokenType

    override fun getTokenStart(): Int = startOffset

    override fun getTokenEnd(): Int = endOffset

    override fun advance() {
        if (endOffset >= bufferEnd) {
            tokenType = null
            return
        }

        startOffset = endOffset
        val char = buffer[endOffset]

        // Whitespace
        if (char.isWhitespace()) {
            while (endOffset < bufferEnd && buffer[endOffset].isWhitespace()) {
                endOffset++
            }
            tokenType = FeelTypes.WHITESPACE
            return
        }

        // Line comment
        if (char == '/' && endOffset + 1 < bufferEnd && buffer[endOffset + 1] == '/') {
            while (endOffset < bufferEnd && buffer[endOffset] != '\n') {
                endOffset++
            }
            tokenType = FeelTypes.COMMENT
            return
        }

        // Block comment
        if (char == '/' && endOffset + 1 < bufferEnd && buffer[endOffset + 1] == '*') {
            endOffset += 2
            while (endOffset < bufferEnd - 1) {
                if (buffer[endOffset] == '*' && buffer[endOffset + 1] == '/') {
                    endOffset += 2
                    break
                }
                endOffset++
            }
            tokenType = FeelTypes.COMMENT
            return
        }

        // String literals
        if (char == '"') {
            endOffset++
            while (endOffset < bufferEnd) {
                val c = buffer[endOffset]
                if (c == '"') {
                    endOffset++
                    break
                }
                if (c == '\\' && endOffset + 1 < bufferEnd) {
                    endOffset++ // Skip escaped character
                }
                endOffset++
            }
            tokenType = FeelTypes.STRING
            return
        }

        // Numbers
        if (char.isDigit() || (char == '-' && endOffset + 1 < bufferEnd && buffer[endOffset + 1].isDigit())) {
            endOffset++
            while (endOffset < bufferEnd && (buffer[endOffset].isDigit() || buffer[endOffset] == '.')) {
                endOffset++
            }
            tokenType = FeelTypes.NUMBER
            return
        }

        // Identifiers and keywords
        if (char.isLetter() || char == '_') {
            while (endOffset < bufferEnd) {
                val c = buffer[endOffset]
                if (!c.isLetterOrDigit() && c != '_' && c != ' ') break
                endOffset++
            }
            val text = buffer.subSequence(startOffset, endOffset).toString().trim()
            tokenType = when {
                FeelTypes.KEYWORD_SET.contains(text) -> FeelTypes.KEYWORD
                FeelTypes.BOOLEAN_SET.contains(text) -> FeelTypes.BOOLEAN
                else -> FeelTypes.IDENTIFIER
            }
            return
        }

        // Operators and delimiters
        tokenType = when (char) {
            '(' -> { endOffset++; FeelTypes.LPAREN }
            ')' -> { endOffset++; FeelTypes.RPAREN }
            '[' -> { endOffset++; FeelTypes.LBRACKET }
            ']' -> { endOffset++; FeelTypes.RBRACKET }
            '{' -> { endOffset++; FeelTypes.LBRACE }
            '}' -> { endOffset++; FeelTypes.RBRACE }
            ',' -> { endOffset++; FeelTypes.COMMA }
            '.' -> { endOffset++; FeelTypes.DOT }
            ':' -> { endOffset++; FeelTypes.COLON }
            '+', '-', '*', '/', '=', '<', '>', '!' -> {
                endOffset++
                while (endOffset < bufferEnd && "+-*/=<>!".contains(buffer[endOffset])) {
                    endOffset++
                }
                FeelTypes.OPERATOR
            }
            else -> { endOffset++; FeelTypes.BAD_CHARACTER }
        }
    }

    override fun getCurrentPosition(): com.intellij.lexer.LexerPosition {
        return object : com.intellij.lexer.LexerPosition {
            override fun getOffset(): Int = startOffset
            override fun getState(): Int = state
        }
    }

    override fun restore(position: com.intellij.lexer.LexerPosition) {
        startOffset = position.offset
        endOffset = position.offset
        state = position.state
        tokenType = null
    }

    override fun getBufferSequence(): CharSequence = buffer

    override fun getBufferEnd(): Int = bufferEnd
}

/**
 * Minimal parser - LSP handles actual parsing
 */
class FeelParser : PsiParser {
    override fun parse(root: com.intellij.psi.tree.IElementType, builder: com.intellij.lang.PsiBuilder): ASTNode {
        val mark = builder.mark()
        while (!builder.eof()) {
            builder.advanceLexer()
        }
        mark.done(root)
        return builder.treeBuilt
    }
}

/**
 * Minimal PSI element
 */
class FeelPsiElement(node: ASTNode) : com.intellij.extapi.psi.ASTWrapperPsiElement(node)
