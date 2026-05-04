import { useState } from 'react';
import './JsonViewer.css';

interface JsonViewerProps {
  data: string | object | null | undefined;
  title?: string;
  className?: string;
}

/**
 * Attempts to repair JavaScript/TypeScript object literal syntax into valid JSON:
 *   - Strips single-line comments
 *   - Quotes unquoted object keys (e.g. `from:` → `"from":`)
 *   - Removes trailing commas before `}` or `]`
 */
function repairJson(input: string): string {
  return input
    .replace(/\/\/[^\n]*/g, '')
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    .replace(/,\s*([}\]])/g, '$1');
}

export function JsonViewer({ data, title, className = '' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formatJson = (): string => {
    if (data === null || data === undefined) {
      return 'null';
    }

    try {
      let parsed: any;
      if (typeof data === 'string') {
        try {
          parsed = JSON.parse(data);
        } catch {
          // Strict parse failed — try repairing unquoted keys / trailing commas
          try {
            parsed = JSON.parse(repairJson(data));
          } catch {
            return data;
          }
        }
      } else {
        parsed = data;
      }

      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  const handleCopy = async () => {
    const formatted = formatJson();
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formattedJson = formatJson();
  const isError = typeof data === 'string' && data.startsWith('Error:');

  return (
    <div className={`json-viewer ${className} ${isError ? 'json-viewer--error' : ''}`}>
      {title && (
        <div className="json-viewer__header">
          <span className="json-viewer__title">{title}</span>
          <button
            className="json-viewer__copy-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="json-viewer__content">
        <code>{formattedJson}</code>
      </pre>
    </div>
  );
}

