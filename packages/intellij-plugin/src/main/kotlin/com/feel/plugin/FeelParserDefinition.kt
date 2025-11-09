package com.feel.plugin

import com.intellij.lang.ASTNode
import com.intellij.lang.ParserDefinition
import com.intellij.lang.PsiParser
import com.intellij.lexer.Lexer
import com.intellij.openapi.project.Project
import com.intellij.psi.FileViewProvider
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import com.intellij.psi.tree.IFileElementType
import com.intellij.psi.tree.TokenSet

/**
 * Parser definition for FEEL language.
 * Since we're using LSP for all language features, this is a minimal implementation.
 */
class FeelParserDefinition : ParserDefinition {
    override fun createLexer(project: Project?): Lexer = FeelLexer()

    override fun createParser(project: Project?): PsiParser = FeelParser()

    override fun getFileNodeType(): IFileElementType = FILE

    override fun getCommentTokens(): TokenSet = TokenSet.EMPTY

    override fun getStringLiteralElements(): TokenSet = TokenSet.EMPTY

    override fun createElement(node: ASTNode?): PsiElement = FeelPsiElement(node!!)

    override fun createFile(viewProvider: FileViewProvider): PsiFile = FeelFile(viewProvider)

    companion object {
        val FILE = IFileElementType(FeelLanguage)
    }
}

/**
 * Minimal lexer - LSP handles actual parsing
 */
class FeelLexer : Lexer() {
    private var buffer: CharSequence = ""
    private var startOffset = 0
    private var endOffset = 0
    private var bufferEnd = 0
    private var state = 0

    override fun start(buffer: CharSequence, startOffset: Int, endOffset: Int, initialState: Int) {
        this.buffer = buffer
        this.startOffset = startOffset
        this.endOffset = endOffset
        this.bufferEnd = endOffset
        this.state = initialState
    }

    override fun getState(): Int = state

    override fun getTokenType() = null

    override fun getTokenStart(): Int = startOffset

    override fun getTokenEnd(): Int = endOffset

    override fun advance() {
        startOffset = endOffset
    }

    override fun getCurrentPosition(): com.intellij.lexer.LexerPosition {
        return object : com.intellij.lexer.LexerPosition {
            override fun getOffset(): Int = startOffset
            override fun getState(): Int = state
        }
    }

    override fun restore(position: com.intellij.lexer.LexerPosition) {
        startOffset = position.offset
        state = position.state
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
