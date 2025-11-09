package com.feel.plugin.lsp

import com.feel.plugin.FeelFileType
import com.intellij.openapi.project.Project
import com.intellij.openapi.vfs.VirtualFile
import com.redhat.devtools.lsp4ij.LanguageServerFactory
import com.redhat.devtools.lsp4ij.client.LanguageClientImpl
import com.redhat.devtools.lsp4ij.server.StreamConnectionProvider

/**
 * LSP Server Support Provider for FEEL Language
 * This class integrates the FEEL LSP server with IntelliJ using LSP4IJ
 */
class FeelLspServerSupportProvider : LanguageServerFactory {

    override fun createConnectionProvider(project: Project): StreamConnectionProvider {
        return FeelLspServerConnectionProvider(project)
    }

    override fun createLanguageClient(project: Project): LanguageClientImpl {
        return LanguageClientImpl(project)
    }

    fun isEnabled(project: Project): Boolean {
        // LSP is always enabled for .feel files
        return true
    }
}
