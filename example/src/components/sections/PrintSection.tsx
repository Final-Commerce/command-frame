import { useState } from "react";
import { renderClient as command } from "@final-commerce/command-frame";
import { CommandSection } from "../CommandSection";
import { JsonViewer } from "../JsonViewer";
import "./Sections.css";

interface PrintSectionProps {
    isInIframe: boolean;
}

export function PrintSection({ isInIframe }: PrintSectionProps) {
    // Image print
    const [imageData, setImageData] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePrintLoading, setImagePrintLoading] = useState(false);
    const [imagePrintResponse, setImagePrintResponse] = useState<string>("");

    // HTML print
    const [htmlContent, setHtmlContent] = useState<string>("<div><h1>Hello World</h1><p>This is a test print</p></div>");
    const [htmlPrintLoading, setHtmlPrintLoading] = useState(false);
    const [htmlPrintResponse, setHtmlPrintResponse] = useState<string>("");

    // Selector print
    const [selector, setSelector] = useState<string>("#print-test-element");
    const [selectorPrintLoading, setSelectorPrintLoading] = useState(false);
    const [selectorPrintResponse, setSelectorPrintResponse] = useState<string>("");

    // Receipt print
    const [receiptPrintLoading, setReceiptPrintLoading] = useState(false);
    const [receiptPrintResponse, setReceiptPrintResponse] = useState<string>("");

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePrintImage = async () => {
        if (!isInIframe) {
            setImagePrintResponse("Error: Not running in iframe");
            return;
        }

        if (!imageData && !imageFile) {
            setImagePrintResponse("Error: Please select an image file or provide base64 data");
            return;
        }

        setImagePrintLoading(true);
        setImagePrintResponse("");

        try {
            const imageToPrint = imageData || (imageFile ? await fileToBase64(imageFile) : "");
            const result = await command.print({
                type: "image",
                data: { image: imageToPrint }
            });
            setImagePrintResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setImagePrintResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setImagePrintLoading(false);
        }
    };

    const handlePrintHTML = async () => {
        if (!isInIframe) {
            setHtmlPrintResponse("Error: Not running in iframe");
            return;
        }

        if (!htmlContent) {
            setHtmlPrintResponse("Error: HTML content is required");
            return;
        }

        setHtmlPrintLoading(true);
        setHtmlPrintResponse("");

        try {
            const result = await command.print({
                type: "html",
                data: { html: htmlContent }
            });
            setHtmlPrintResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setHtmlPrintResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setHtmlPrintLoading(false);
        }
    };

    const handlePrintSelector = async () => {
        if (!isInIframe) {
            setSelectorPrintResponse("Error: Not running in iframe");
            return;
        }

        if (!selector) {
            setSelectorPrintResponse("Error: Selector is required");
            return;
        }

        setSelectorPrintLoading(true);
        setSelectorPrintResponse("");

        try {
            const result = await command.print({
                type: "selector",
                data: { selector }
            });
            setSelectorPrintResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setSelectorPrintResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setSelectorPrintLoading(false);
        }
    };

    const handlePrintReceipt = async () => {
        if (!isInIframe) {
            setReceiptPrintResponse("Error: Not running in iframe");
            return;
        }

        setReceiptPrintLoading(true);
        setReceiptPrintResponse("");

        try {
            // Get current cart to use as order data
            const cart = await command.getCurrentCart();

            // Convert cart to order format (simplified)
            // Note: CFActiveCart doesn't have an id, so we create a temporary one
            const orderData = {
                ...cart.cart,
                id: "temp-order-id"
            };

            const result = await command.print({
                type: "receipt",
                data: { order: orderData as any }
            });
            setReceiptPrintResponse(JSON.stringify(result, null, 2));
        } catch (error) {
            setReceiptPrintResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setReceiptPrintLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="section-content">
            {/* Test element for selector printing */}
            <div id="print-test-element" style={{ display: "none", padding: "20px", border: "1px solid #ccc", margin: "20px 0" }}>
                <h2>Test Element for Selector Printing</h2>
                <p>This element can be printed using the selector: #print-test-element</p>
                <p>Current time: {new Date().toLocaleString()}</p>
            </div>

            <CommandSection title="Print Image">
                <p className="section-description">Print a base64-encoded image directly to the printer.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>Image File:</label>
                        <input type="file" accept="image/*" onChange={handleImageFileChange} />
                    </div>
                    <div className="form-field">
                        <label>Or Base64 Image Data:</label>
                        <textarea
                            value={imageData}
                            onChange={e => setImageData(e.target.value)}
                            placeholder="data:image/png;base64,iVBORw0KGgo..."
                            rows={3}
                        />
                    </div>
                </div>
                <button onClick={handlePrintImage} disabled={imagePrintLoading} className="btn btn--primary">
                    {imagePrintLoading ? "Printing..." : "Print Image"}
                </button>
                {imagePrintResponse && <JsonViewer data={imagePrintResponse} title={imagePrintResponse.startsWith("Error") ? "Error" : "Success"} />}
            </CommandSection>

            <CommandSection title="Print HTML">
                <p className="section-description">
                    Print HTML content by rendering it and converting to an image (native) or opening print dialog (web).
                </p>
                <div className="form-group">
                    <div className="form-field">
                        <label>HTML Content:</label>
                        <textarea
                            value={htmlContent}
                            onChange={e => setHtmlContent(e.target.value)}
                            placeholder="<div>Your HTML here</div>"
                            rows={6}
                        />
                    </div>
                </div>
                <button onClick={handlePrintHTML} disabled={htmlPrintLoading} className="btn btn--primary">
                    {htmlPrintLoading ? "Printing..." : "Print HTML"}
                </button>
                {htmlPrintResponse && <JsonViewer data={htmlPrintResponse} title={htmlPrintResponse.startsWith("Error") ? "Error" : "Success"} />}
            </CommandSection>

            <CommandSection title="Print Element by Selector">
                <p className="section-description">Print an existing DOM element by query selector. The element must exist in the DOM.</p>
                <div className="form-group">
                    <div className="form-field">
                        <label>CSS Selector:</label>
                        <input type="text" value={selector} onChange={e => setSelector(e.target.value)} placeholder="#my-element or .my-class" />
                    </div>
                </div>
                <p className="section-note">
                    Try printing the test element above using: <code>#print-test-element</code>
                </p>
                <button onClick={handlePrintSelector} disabled={selectorPrintLoading} className="btn btn--primary">
                    {selectorPrintLoading ? "Printing..." : "Print Element"}
                </button>
                {selectorPrintResponse && (
                    <JsonViewer data={selectorPrintResponse} title={selectorPrintResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>

            <CommandSection title="Print Receipt">
                <p className="section-description">Print a receipt using the existing receipt printing system with the current cart data.</p>
                <button onClick={handlePrintReceipt} disabled={receiptPrintLoading} className="btn btn--primary">
                    {receiptPrintLoading ? "Printing..." : "Print Receipt"}
                </button>
                {receiptPrintResponse && (
                    <JsonViewer data={receiptPrintResponse} title={receiptPrintResponse.startsWith("Error") ? "Error" : "Success"} />
                )}
            </CommandSection>
        </div>
    );
}
