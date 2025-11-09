package com.feel.plugin.lsp

import com.intellij.ide.plugins.PluginManagerCore
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.extensions.PluginId
import com.intellij.openapi.project.Project
import com.intellij.openapi.util.SystemInfo
import com.redhat.devtools.lsp4ij.server.ProcessStreamConnectionProvider
import java.io.File

/**
 * Connection provider that starts the FEEL LSP server process
 * Uses standalone binary (no Node.js required)
 */
class FeelLspServerConnectionProvider(project: Project) : ProcessStreamConnectionProvider() {

    private val logger = Logger.getInstance(FeelLspServerConnectionProvider::class.java)

    init {
        val commands = createCommandLine(project)
        super.setCommands(commands)
    }

    private fun createCommandLine(project: Project): List<String> {
        // Find bundled LSP server binary
        val serverPath = findServerBinary()
            ?: throw RuntimeException("FEEL Language Server binary not found. Plugin may be corrupted or incompatible with your platform.")

        logger.info("Starting FEEL Language Server: $serverPath --stdio")

        return listOf(
            serverPath,
            "--stdio"
        )
    }

    /**
     * Get the appropriate binary name for the current platform
     */
    private fun getBinaryName(): String {
        val arch = System.getProperty("os.arch")

        return when {
            SystemInfo.isMac -> {
                if (arch == "aarch64" || arch == "arm64") {
                    "feel-lsp-darwin-arm64"
                } else {
                    "feel-lsp-darwin-x64"
                }
            }
            SystemInfo.isLinux -> {
                if (arch == "aarch64" || arch == "arm64") {
                    "feel-lsp-linux-arm64"
                } else {
                    "feel-lsp-linux-x64"
                }
            }
            SystemInfo.isWindows -> "feel-lsp-win32-x64.exe"
            else -> throw RuntimeException("Unsupported platform: ${SystemInfo.OS_NAME}-$arch")
        }
    }

    private fun findServerBinary(): String? {
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

            val binaryName = getBinaryName()
            logger.info("Looking for binary: $binaryName")

            // Look for LSP server binary in plugin directory
            val serverPath = File(pluginPath.toFile(), "lsp-server/$binaryName")

            if (serverPath.exists() && serverPath.canExecute()) {
                logger.info("Found FEEL Language Server at: ${serverPath.absolutePath}")
                return serverPath.absolutePath
            }

            logger.error("FEEL Language Server not found or not executable at: ${serverPath.absolutePath}")
            return null
        } catch (e: Exception) {
            logger.error("Failed to find FEEL Language Server", e)
            return null
        }
    }
}
