package com.feel.plugin.lsp

import com.intellij.execution.configurations.GeneralCommandLine
import com.intellij.ide.plugins.PluginManagerCore
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.extensions.PluginId
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.SystemInfo
import com.redhat.devtools.lsp4ij.server.ProcessStreamConnectionProvider
import java.io.File
import java.nio.file.Files

/**
 * Connection provider that starts the FEEL LSP server process
 * Similar to VS Code extension's approach of spawning the Node.js server
 */
class FeelLspServerConnectionProvider(project: Project) : ProcessStreamConnectionProvider() {

    private val logger = Logger.getInstance(FeelLspServerConnectionProvider::class.java)

    init {
        val commands = createCommandLine(project)
        super.setCommands(commands)
    }

    private fun createCommandLine(project: Project): List<String> {
        // Find Node.js executable
        val nodeExecutable = findNodeExecutable()
            ?: throw RuntimeException("Node.js not found. Please install Node.js to use FEEL language support.")

        // Find bundled LSP server
        val serverPath = findServerPath()
            ?: throw RuntimeException("FEEL Language Server not found. Plugin may be corrupted.")

        logger.info("Starting FEEL Language Server: $nodeExecutable $serverPath --stdio")

        return listOf(
            nodeExecutable,
            serverPath,
            "--stdio"
        )
    }

    private fun findNodeExecutable(): String? {
        // Try common Node.js locations
        val candidates = if (SystemInfo.isWindows) {
            listOf(
                "node.exe",
                "C:\\Program Files\\nodejs\\node.exe",
                "C:\\Program Files (x86)\\nodejs\\node.exe"
            )
        } else {
            listOf(
                "node",
                "/usr/local/bin/node",
                "/usr/bin/node",
                "/opt/homebrew/bin/node"
            )
        }

        // Check PATH first
        val pathNode = candidates.firstOrNull { path ->
            try {
                val commandLine = GeneralCommandLine(path, "--version")
                commandLine.createProcess().waitFor()
                true
            } catch (e: Exception) {
                false
            }
        }

        if (pathNode != null) return pathNode

        // Check specific paths
        return candidates.firstOrNull { path ->
            File(path).exists() && File(path).canExecute()
        }
    }

    private fun findServerPath(): String? {
        try {
            // Get plugin directory using PluginManager
            val pluginId = PluginId.getId("com.feel.language-support")
            val plugin = PluginManagerCore.getPlugin(pluginId)
            if (plugin == null) {
                logger.error("FEEL plugin not found in PluginManager")
                return null
            }

            val pluginPath = plugin.pluginPath
            logger.info("Plugin path: $pluginPath")

            // Look for LSP server in plugin directory (copied by prepareSandbox task)
            val serverPath = File(pluginPath.toFile(), "lsp-server/cli.js")

            if (serverPath.exists() && serverPath.canRead()) {
                logger.info("Found FEEL Language Server at: ${serverPath.absolutePath}")
                return serverPath.absolutePath
            }

            logger.error("FEEL Language Server not found at: ${serverPath.absolutePath}")
            return null
        } catch (e: Exception) {
            logger.error("Failed to find FEEL Language Server", e)
            return null
        }
    }
}
