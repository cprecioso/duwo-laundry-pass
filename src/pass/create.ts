import creator from "pass-creator"
import * as template from "./template"

export function createPass(data: template.TemplateData) {
  return creator(template.default(data))
}
export default createPass
