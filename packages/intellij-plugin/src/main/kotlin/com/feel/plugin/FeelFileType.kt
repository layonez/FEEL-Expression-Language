package com.feel.plugin

import com.intellij.openapi.fileTypes.LanguageFileType
import javax.swing.Icon

/**
 * FEEL File Type definition for .feel files
 */
object FeelFileType : LanguageFileType(FeelLanguage) {
    override fun getName(): String = "FEEL"

    override fun getDescription(): String = "FEEL Expression Language"

    override fun getDefaultExtension(): String = "feel"

    override fun getIcon(): Icon? = FeelIcons.FILE
}
