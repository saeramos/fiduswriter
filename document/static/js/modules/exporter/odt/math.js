import TeXZilla from "texzilla"

export class OdtExporterMath {
    constructor(exporter) {
        this.exporter = exporter
        this.objectCounter = 1
        this.manifestXml = false
    }

    init() {
        return this.exporter.xml.getXml("META-INF/manifest.xml").then(
            manifestXml => {
                this.manifestXml = manifestXml
                this.checkObjectCounter()
                return Promise.resolve()
            }
        )
    }

    checkObjectCounter() {
        let manifestEl = this.manifestXml.querySelector('manifest')
        let fileEntries = manifestEl.querySelectorAll('file-entry')

        fileEntries.forEach(
            fileEntry => {
                let fullPath = fileEntry.getAttribute('manifest:full-path')
                let dir = fullPath.split('/')[0]
                let dirParts = dir.split(' ')
                if (dirParts.length===2 && dirParts[0] === 'Object') {
                    let objectNumber =  parseInt(dirParts[1])
                    if (objectNumber >= this.objectCounter) {
                        this.objectCounter = objectNumber + 1
                    }
                }
            }
        )
    }

    addMath(latex) {
        let mathml = TeXZilla.toMathML(latex)
        let objectNumber = this.objectCounter++
        this.exporter.xml.addXmlFile(`Object ${objectNumber}/content.xml`, mathml)
        let manifestEl = this.manifestXml.querySelector('manifest')
        let stringOne = `<manifest:file-entry manifest:full-path="Object ${objectNumber}/content.xml" manifest:media-type="text/xml"/>`
        manifestEl.insertAdjacentHTML('beforeEnd', stringOne)
        let stringTwo = `<manifest:file-entry manifest:full-path="Object ${objectNumber}/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.formula"/>`
        manifestEl.insertAdjacentHTML('beforeEnd', stringTwo)
        return objectNumber
    }

}
