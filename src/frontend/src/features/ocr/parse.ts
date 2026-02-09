export interface ParsedOrderData {
  customerName: string;
  street: string;
}

export function parseOcrText(text: string): ParsedOrderData {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let customerName = '';
  let street = '';

  // Common patterns for customer names
  const namePatterns = [
    /(?:name|nome|customer|cliente)[:\s]+(.+)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)$/,
  ];

  // Common patterns for streets
  const streetPatterns = [
    /(?:street|rua|address|endereço|endereco)[:\s]+(.+)/i,
    /(?:^|\s)(rua|av|avenida|travessa|alameda)\s+(.+)/i,
  ];

  // Try to find customer name
  for (const line of lines) {
    for (const pattern of namePatterns) {
      const match = line.match(pattern);
      if (match) {
        customerName = match[1] || match[0];
        break;
      }
    }
    if (customerName) break;
  }

  // Try to find street
  for (const line of lines) {
    for (const pattern of streetPatterns) {
      const match = line.match(pattern);
      if (match) {
        street = match[2] || match[1] || match[0];
        break;
      }
    }
    if (street) break;
  }

  // Fallback: use first line as customer name if not found
  if (!customerName && lines.length > 0) {
    customerName = lines[0];
  }

  // Fallback: use second line as street if not found
  if (!street && lines.length > 1) {
    street = lines[1];
  }

  return {
    customerName: customerName.trim(),
    street: street.trim(),
  };
}
