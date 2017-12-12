import * as vfs from "vinyl-fs"
import { PassbookPackage } from "pass-creator"
import { resolve } from "path"

export interface TemplateData {
  id: string,
  qrId: string,
  email: string,
  balance: number,
  webServiceURL: string,
  authenticationToken: string
}

export default function constructPass(data: TemplateData) {
  return (<PassbookPackage>{
    pass: {
      description: "Card to hold your DUWO Laundry credit",
      formatVersion: 1,
      organizationName: "DUWO",
      passTypeIdentifier: "pass.nl.duwo.laundry-card",
      serialNumber: data.id,
      teamIdentifier: "nl.duwo",
      storeCard: {
        headerFields: [
          {
            key: "balance-header",
            label: "Balance",
            value: data.balance / 100,
            currencyCode: "EUR",
            textAlignment: "PKTextAlignmentRight"
          }
        ],
        primaryFields: [
          {
            key: "balance-big",
            label: "Remaining balance",
            value: data.balance / 100,
            currencyCode: "EUR",
            changeMessage: "Your new balance is %@"
          }
        ],
        secondaryFields: [
          {
            key: "email",
            label: "Email",
            value: data.email
          }
        ]
      },
      barcodes: [{
        format: "PKBarcodeFormatQR",
        message: data.qrId,
        messageEncoding: "iso-8859-1"
      }],
      backgroundColor: "rgb(255,255,255)",
      foregroundColor: "rgb(100,100,100)",
      labelColor: "rgb(225,0,23)",
      logoText: "DUWO Laundry",
      locations: [
        {
          latitude: 52.007942,
          longitude: 4.367802,
          relevantText: "Time to do laundry!"
        }
      ],
      maxDistance: 5,
      webServiceURL: data.webServiceURL,
      authenticationToken: data.authenticationToken
    },
    images: vfs.src(resolve(__dirname, "../../passImages/*.png"))
  })
}
