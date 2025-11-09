import org.jetbrains.intellij.platform.gradle.TestFrameworkType

plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "2.1.0"
    id("org.jetbrains.intellij.platform") version "2.1.0"
}

group = "com.feel"
version = "0.0.1"

repositories {
    mavenCentral()

    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdeaCommunity("2024.3")

        // LSP4IJ plugin dependency
        plugin("com.redhat.devtools.lsp4ij:0.10.0")

        pluginVerifier()
        zipSigner()
        instrumentationTools()
        testFramework(TestFrameworkType.Platform)
    }

    testImplementation("junit:junit:4.13.2")
}

kotlin {
    jvmToolchain(21)
}

intellijPlatform {
    pluginConfiguration {
        name = "FEEL Language Support"
        version = providers.gradleProperty("version").get()

        description = """
            Language support for FEEL (Friendly Enough Expression Language) with LSP-based features:
            syntax highlighting, diagnostics, hover documentation, and code completion.
        """.trimIndent()

        ideaVersion {
            sinceBuild = "243"
            untilBuild = "253.*"
        }
    }

    pluginVerification {
        ides {
            recommended()
        }
    }
}

tasks {
    wrapper {
        gradleVersion = "8.11"
    }

    buildSearchableOptions {
        enabled = false
    }

    // Copy LSP server to plugin distribution (not inside JAR)
    prepareSandbox {
        doLast {
            val lspServerSource = file("src/main/resources/lsp-server")
            // Get the actual sandbox plugins directory which includes the IDE version
            val sandboxDir = intellijPlatform.sandboxContainer.get()
            val pluginsDir = file("$sandboxDir").listFiles()?.find { it.name.startsWith("IC-") || it.name.startsWith("IU-") }
            val lspServerDest = if (pluginsDir != null) {
                file("${pluginsDir.absolutePath}/plugins/intellij-feel-plugin/lsp-server")
            } else {
                file("$sandboxDir/plugins/intellij-feel-plugin/lsp-server")
            }

            if (lspServerSource.exists()) {
                copy {
                    from(lspServerSource)
                    into(lspServerDest)
                }
                println("Copied LSP server to: $lspServerDest")
            }
        }
    }
}
