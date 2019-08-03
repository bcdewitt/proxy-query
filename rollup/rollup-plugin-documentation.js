import path from 'path'
import findProjectRoot from 'find-project-root'
import fs from 'fs'
import documentation from 'documentation'

export default ({ input, output, format = 'md' }) => ({
  name: 'documentation',
  buildEnd(error) {
    if (error || process.env.NODE_ENV === 'test') return

    const rootPath = findProjectRoot(process.cwd())
    const inputFilePath = path.join(rootPath, input)
    const outputFilePath = path.join(rootPath, output)

    // TODO: Compare source with cache. Skip if unchanged
    documentation.build([inputFilePath], {})
      .then(documentation.formats[format])
      .then(output => {
        // Ensure the output directory exists
        const outputDir = path.dirname(outputFilePath)
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }
        fs.writeFileSync(outputFilePath, output)
      })
  }
})
