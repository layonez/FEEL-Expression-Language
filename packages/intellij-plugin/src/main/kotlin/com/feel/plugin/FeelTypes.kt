package com.feel.plugin

import com.intellij.psi.tree.IElementType
import com.intellij.psi.tree.TokenSet

/**
 * Token types for FEEL language
 */
object FeelTypes {
    // Keywords
    @JvmField val KEYWORD = IElementType("KEYWORD", FeelLanguage)

    // Identifiers and literals
    @JvmField val IDENTIFIER = IElementType("IDENTIFIER", FeelLanguage)
    @JvmField val NUMBER = IElementType("NUMBER", FeelLanguage)
    @JvmField val STRING = IElementType("STRING", FeelLanguage)
    @JvmField val BOOLEAN = IElementType("BOOLEAN", FeelLanguage)

    // Operators
    @JvmField val OPERATOR = IElementType("OPERATOR", FeelLanguage)

    // Delimiters
    @JvmField val LPAREN = IElementType("LPAREN", FeelLanguage)
    @JvmField val RPAREN = IElementType("RPAREN", FeelLanguage)
    @JvmField val LBRACKET = IElementType("LBRACKET", FeelLanguage)
    @JvmField val RBRACKET = IElementType("RBRACKET", FeelLanguage)
    @JvmField val LBRACE = IElementType("LBRACE", FeelLanguage)
    @JvmField val RBRACE = IElementType("RBRACE", FeelLanguage)
    @JvmField val COMMA = IElementType("COMMA", FeelLanguage)
    @JvmField val DOT = IElementType("DOT", FeelLanguage)
    @JvmField val COLON = IElementType("COLON", FeelLanguage)

    // Special
    @JvmField val COMMENT = IElementType("COMMENT", FeelLanguage)
    @JvmField val WHITESPACE = IElementType("WHITESPACE", FeelLanguage)
    @JvmField val BAD_CHARACTER = IElementType("BAD_CHARACTER", FeelLanguage)

    // Token sets for parser
    @JvmField val KEYWORDS = TokenSet.create(KEYWORD)
    @JvmField val COMMENTS = TokenSet.create(COMMENT)
    @JvmField val STRINGS = TokenSet.create(STRING)
    @JvmField val WHITESPACES = TokenSet.create(WHITESPACE)

    // FEEL keywords (for lexer pattern matching)
    val KEYWORD_SET = setOf(
        "if", "then", "else",
        "for", "in", "return",
        "some", "every", "satisfies",
        "and", "or", "not",
        "between", "instance", "of",
        "null", "function", "external"
    )

    val BOOLEAN_SET = setOf("true", "false")
}
