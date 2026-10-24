from pathlib import Path
import json
root=Path(__file__).parent
resources={"css":(root/"site.css").read_text(encoding="utf-8"),"runtime":(root/"runtime.js").read_text(encoding="utf-8"),"layout":(root/"layout.js").read_text(encoding="utf-8"),"icons":(root/"icons.js").read_text(encoding="utf-8"),"iconLicense":"\n\n".join((root/"icons"/name).read_text(encoding="utf-8") for name in ["README.md","MATERIAL-LICENSE.txt","SIMPLE-ICONS-LICENSE.md"])}
(root/"resources.js").write_text("window.FORGE_RESOURCES = "+json.dumps(resources,ensure_ascii=True)+";\n",encoding="utf-8")
print("Preview and export resources refreshed.")
