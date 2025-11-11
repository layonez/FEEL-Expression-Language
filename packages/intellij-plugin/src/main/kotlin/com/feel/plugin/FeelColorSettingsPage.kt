package com.feel.plugin

import com.intellij.openapi.editor.colors.TextAttributesKey
import com.intellij.openapi.fileTypes.SyntaxHighlighter
import com.intellij.openapi.options.colors.AttributesDescriptor
import com.intellij.openapi.options.colors.ColorDescriptor
import com.intellij.openapi.options.colors.ColorSettingsPage
import javax.swing.Icon

/**
 * Color settings page for FEEL language.
 * Allows users to customize syntax highlighting colors in Settings/Preferences.
 */
class FeelColorSettingsPage : ColorSettingsPage {
    override fun getIcon(): Icon? = FeelFileType.icon

    override fun getHighlighter(): SyntaxHighlighter = FeelSyntaxHighlighter()

    override fun getDemoText(): String = """
        // FEEL Expression Example
        /* Multi-line
           comment */

        if age >= 18 then "adult" else "minor"

        for x in [1, 2, 3] return x * 2

        some item in items satisfies item > 10

        {
          name: "John",
          age: 25,
          active: true,
          score: 95.5
        }

        function(x, y) x + y

        date and time("2024-01-01T12:00:00")
    """.trimIndent()

    override fun getAdditionalHighlightingTagToDescriptorMap(): Map<String, TextAttributesKey>? = null

    override fun getAttributeDescriptors(): Array<AttributesDescriptor> = DESCRIPTORS

    override fun getColorDescriptors(): Array<ColorDescriptor> = ColorDescriptor.EMPTY_ARRAY

    override fun getDisplayName(): String = "FEEL"

    companion object {
        private val DESCRIPTORS = arrayOf(
            AttributesDescriptor("Keyword", FeelSyntaxHighlighter.KEYWORD),
            AttributesDescriptor("String", FeelSyntaxHighlighter.STRING),
            AttributesDescriptor("Number", FeelSyntaxHighlighter.NUMBER),
            AttributesDescriptor("Comment", FeelSyntaxHighlighter.COMMENT),
            AttributesDescriptor("Operator", FeelSyntaxHighlighter.OPERATOR),
            AttributesDescriptor("Identifier", FeelSyntaxHighlighter.IDENTIFIER),
            AttributesDescriptor("Parentheses", FeelSyntaxHighlighter.PARENTHESES),
            AttributesDescriptor("Brackets", FeelSyntaxHighlighter.BRACKETS),
            AttributesDescriptor("Braces", FeelSyntaxHighlighter.BRACES),
            AttributesDescriptor("Comma", FeelSyntaxHighlighter.COMMA),
            AttributesDescriptor("Dot", FeelSyntaxHighlighter.DOT),
            AttributesDescriptor("Colon", FeelSyntaxHighlighter.COLON),
            AttributesDescriptor("Bad Character", FeelSyntaxHighlighter.BAD_CHARACTER)
        )
    }
}
