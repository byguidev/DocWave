import {
  PDFDocument,
  PDFArray,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFString,
  PDFDict,
  PDFInvalidObject,
} from "@cantoo/pdf-lib";

// Ported from @signpdf/placeholder-pdf-lib, which hard-depends on the
// original `pdf-lib` package and does `instanceof` checks against its
// classes. Those checks fail against @cantoo/pdf-lib objects (same shape,
// different class references), so we reimplement it here against our own
// fork's exports instead of pulling in the original pdf-lib as well.

const DEFAULT_SIGNATURE_LENGTH = 8192;
const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
const SUBFILTER_ADOBE_PKCS7_DETACHED = "adbe.pkcs7.detached";
const SIG_FLAGS_SIGNATURES_EXIST = 1;
const SIG_FLAGS_APPEND_ONLY = 2;
const ANNOTATION_FLAG_PRINT = 4;

export type AddPlaceholderOptions = {
  pdfDoc: PDFDocument;
  reason: string;
  contactInfo: string;
  name: string;
  location: string;
};

export function addSignaturePlaceholder({
  pdfDoc,
  reason,
  contactInfo,
  name,
  location,
}: AddPlaceholderOptions): void {
  const doc = pdfDoc;
  const page = doc.getPages()[0];
  const context = doc.context;

  const byteRange = PDFArray.withContext(context);
  byteRange.push(PDFNumber.of(0));
  byteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
  byteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
  byteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));

  const placeholder = PDFHexString.of(String.fromCharCode(0).repeat(DEFAULT_SIGNATURE_LENGTH));

  const signatureDict = context.obj({
    Type: "Sig",
    Filter: "Adobe.PPKLite",
    SubFilter: SUBFILTER_ADOBE_PKCS7_DETACHED,
    ByteRange: byteRange,
    Contents: placeholder,
    Reason: PDFString.of(reason),
    M: PDFString.fromDate(new Date()),
    ContactInfo: PDFString.of(contactInfo),
    Name: PDFString.of(name),
    Location: PDFString.of(location),
  });

  const signatureBuffer = new Uint8Array(signatureDict.sizeInBytes());
  signatureDict.copyBytesInto(signatureBuffer, 0);
  const signatureObj = PDFInvalidObject.of(signatureBuffer);
  const signatureDictRef = context.register(signatureObj);

  const widgetRect = [0, 0, 0, 0];
  const rect = PDFArray.withContext(context);
  widgetRect.forEach((c) => rect.push(PDFNumber.of(c)));
  const apStream = context.formXObject([], { BBox: widgetRect, Resources: {} });

  const widgetDict = context.obj({
    Type: "Annot",
    Subtype: "Widget",
    FT: "Sig",
    Rect: rect,
    V: signatureDictRef,
    T: PDFString.of("Signature1"),
    F: ANNOTATION_FLAG_PRINT,
    P: page.ref,
    AP: { N: context.register(apStream) },
  });
  const widgetDictRef = context.register(widgetDict);

  let annotations = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
  if (typeof annotations === "undefined") {
    annotations = context.obj([]);
  }
  annotations.push(widgetDictRef);
  page.node.set(PDFName.of("Annots"), annotations);

  let acroForm = doc.catalog.lookupMaybe(PDFName.of("AcroForm"), PDFDict);
  if (typeof acroForm === "undefined") {
    acroForm = context.obj({ Fields: [] });
    const acroFormRef = context.register(acroForm);
    doc.catalog.set(PDFName.of("AcroForm"), acroFormRef);
  }

  let sigFlags: PDFNumber;
  if (acroForm.has(PDFName.of("SigFlags"))) {
    sigFlags = acroForm.get(PDFName.of("SigFlags")) as PDFNumber;
  } else {
    sigFlags = PDFNumber.of(0);
  }
  const updatedFlags = PDFNumber.of(
    sigFlags.asNumber() | SIG_FLAGS_SIGNATURES_EXIST | SIG_FLAGS_APPEND_ONLY
  );
  acroForm.set(PDFName.of("SigFlags"), updatedFlags);

  let fields = acroForm.get(PDFName.of("Fields"));
  if (!(fields instanceof PDFArray)) {
    fields = context.obj([]);
    acroForm.set(PDFName.of("Fields"), fields);
  }
  (fields as PDFArray).push(widgetDictRef);
}
