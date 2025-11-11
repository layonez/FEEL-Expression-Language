package com.feel.plugin

import com.intellij.lexer.Lexer
import com.intellij.openapi.editor.DefaultLanguageHighlighterColors
import com.intellij.openapi.editor.colors.TextAttributesKey
import com.intellij.openapi.fileTypes.SyntaxHighlighterBase
import com.intellij.psi.tree.IElementType

/**
 * Syntax highlighter for FEEL language.
 * Provides base lexical highlighting that's enhanced by LSP semantic tokens.
 */
class FeelSyntaxHighlighter : SyntaxHighlighterBase() {
    override fun getHighlightingLexer(): Lexer = FeelLexer()

    override fun getTokenHighlights(tokenType: IElementType?): Array<TextAttributesKey> {
        return when (tokenType) {
            FeelTypes.KEYWORD -> KEYWORD_KEYS
            FeelTypes.STRING -> STRING_KEYS
            FeelTypes.NUMBER -> NUMBER_KEYS
            FeelTypes.BOOLEAN -> KEYWORD_KEYS
            FeelTypes.COMMENT -> COMMENT_KEYS
            FeelTypes.OPERATOR -> OPERATOR_KEYS
            FeelTypes.LPAREN, FeelTypes.RPAREN -> PARENTHESES_KEYS
            FeelTypes.LBRACKET, FeelTypes.RBRACKET -> BRACKETS_KEYS
            FeelTypes.LBRACE, FeelTypes.RBRACE -> BRACES_KEYS
            FeelTypes.COMMA -> COMMA_KEYS
            FeelTypes.DOT -> DOT_KEYS
            FeelTypes.COLON -> COLON_KEYS
            FeelTypes.IDENTIFIER -> IDENTIFIER_KEYS
            FeelTypes.BAD_CHARACTER -> BAD_CHAR_KEYS
            else -> EMPTY_KEYS
        }
    }

    companion object {
        val KEYWORD = TextAttributesKey.createTextAttributesKey(
            "FEEL_KEYWORD",
            DefaultLanguageHighlighterColors.KEYWORD
        )

        val STRING = TextAttributesKey.createTextAttributesKey(
            "FEEL_STRING",
            DefaultLanguageHighlighterColors.STRING
        )

        val NUMBER = TextAttributesKey.createTextAttributesKey(
            "FEEL_NUMBER",
            DefaultLanguageHighlighterColors.NUMBER
        )

        val COMMENT = TextAttributesKey.createTextAttributesKey(
            "FEEL_COMMENT",
            DefaultLanguageHighlighterColors.LINE_COMMENT
        )

        val OPERATOR = TextAttributesKey.createTextAttributesKey(
            "FEEL_OPERATOR",
            DefaultLanguageHighlighterColors.OPERATION_SIGN
        )

        val PARENTHESES = TextAttributesKey.createTextAttributesKey(
            "FEEL_PARENTHESES",
            DefaultLanguageHighlighterColors.PARENTHESES
        )

        val BRACKETS = TextAttributesKey.createTextAttributesKey(
            "FEEL_BRACKETS",
            DefaultLanguageHighlighterColors.BRACKETS
        )

        val BRACES = TextAttributesKey.createTextAttributesKey(
            "FEEL_BRACES",
            DefaultLanguageHighlighterColors.BRACES
        )

        val COMMA = TextAttributesKey.createTextAttributesKey(
            "FEEL_COMMA",
            DefaultLanguageHighlighterColors.COMMA
        )

        val DOT = TextAttributesKey.createTextAttributesKey(
            "FEEL_DOT",
            DefaultLanguageHighlighterColors.DOT
        )

        val COLON = TextAttributesKey.createTextAttributesKey(
            "FEEL_COLON",
            DefaultLanguageHighlighterColors.SEMICOLON
        )

        val IDENTIFIER = TextAttributesKey.createTextAttributesKey(
            "FEEL_IDENTIFIER",
            DefaultLanguageHighlighterColors.IDENTIFIER
        )

        val BAD_CHARACTER = TextAttributesKey.createTextAttributesKey(
            "FEEL_BAD_CHARACTER",
            DefaultLanguageHighlighterColors.INVALID_STRING_ESCAPE
        )

        private val KEYWORD_KEYS = arrayOf(KEYWORD)
        private val STRING_KEYS = arrayOf(STRING)
        private val NUMBER_KEYS = arrayOf(NUMBER)
        private val COMMENT_KEYS = arrayOf(COMMENT)
        private val OPERATOR_KEYS = arrayOf(OPERATOR)
        private val PARENTHESES_KEYS = arrayOf(PARENTHESES)
        private val BRACKETS_KEYS = arrayOf(BRACKETS)
        private val BRACES_KEYS = arrayOf(BRACES)
        private val COMMA_KEYS = arrayOf(COMMA)
        private val DOT_KEYS = arrayOf(DOT)
        private val COLON_KEYS = arrayOf(COLON)
        private val IDENTIFIER_KEYS = arrayOf(IDENTIFIER)
        private val BAD_CHAR_KEYS = arrayOf(BAD_CHARACTER)
        private val EMPTY_KEYS = arrayOf<TextAttributesKey>()
    }
}
