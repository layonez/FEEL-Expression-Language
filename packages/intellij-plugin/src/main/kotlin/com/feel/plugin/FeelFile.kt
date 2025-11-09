package com.feel.plugin

import com.intellij.extapi.psi.PsiFileBase
import com.intellij.psi.FileViewProvider

/**
 * PSI File for FEEL language
 */
class FeelFile(viewProvider: FileViewProvider) : PsiFileBase(viewProvider, FeelLanguage) {
    override fun getFileType() = FeelFileType

    override fun toString(): String = "FEEL File"
}
