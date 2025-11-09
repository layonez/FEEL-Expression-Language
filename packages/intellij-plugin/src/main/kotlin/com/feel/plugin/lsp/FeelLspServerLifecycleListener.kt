package com.feel.plugin.lsp

import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManagerListener

/**
 * Lifecycle listener for FEEL LSP server
 * Handles cleanup when projects are closed
 */
class FeelLspServerLifecycleListener : ProjectManagerListener {

    private val logger = Logger.getInstance(FeelLspServerLifecycleListener::class.java)

    override fun projectOpened(project: Project) {
        logger.info("FEEL Language Support: Project opened - ${project.name}")
    }

    override fun projectClosed(project: Project) {
        logger.info("FEEL Language Support: Project closed - ${project.name}")
    }
}
