// Format an object to styled HTML content
export const formatObject = (obj: Record<string, any>): string => {
	return Object.entries(obj)
		.map(([key, value]) => {
			const colorKey = `<span style="color: lightblue;">${key}</span>`;
			let colorValue = formatValue(value);
			return `<div class="px-6">${colorKey}: ${colorValue}</div>`;
		})
		.join('');
};

// Generate a one-line summary for an object
export const formatObjectSummary = (obj: Record<string, any>): string => {
	const entries = Object.entries(obj);
	if (entries.length === 0) return '';

	const [firstKey, firstValue] = entries[0];
	const colorKey = `<span style="color: lightblue;">${firstKey}</span>`;
	const colorValue = formatValue(firstValue);

	return `&lcub;${colorKey}: ${colorValue}, ...&rcub;`;
};

// Helper to format individual values based on type
export const formatValue = (value: any): string => {
	if (typeof value === 'string') {
		return `<span style="color: lightgreen;">${value}</span>`;
	} else if (typeof value === 'number') {
		return `<span style="color: orange;">${value}</span>`;
	} else if (typeof value === 'boolean') {
		return `<span style="color: violet;">${value}</span>`;
	} else if (Array.isArray(value)) {
		return `<span style="color: lightblue;">Array(${value.length})</span>`;
	} else if (typeof value === 'object' && value !== null) {
		return formatObject(value);
	} else {
		return `<span>${value}</span>`;
	}
};

// Format an array for a summary and details view
export const formatArray = (arr: any[]): { summary: string; details: string } => {
	const summary = `(${arr.length}) ${arr
		.map((item, index) => {
			// Except for object items, show the value directly
			if (typeof item !== 'object') {
				return formatValue(item);
			}
			// For object items, show a summary for the first item and {...} for the rest
			if (index === 0) {
				return formatObjectSummary(item);
			} else {
				return `&lcub;...&rcub;`; // {...}
			}
		})
		.join(', ')}`;

	const details = arr
		.map((item, index) => {
			const formattedValue = formatValue(item);
			//Check for object in array
			if (typeof item === 'object') {
				return `<div class="px-4">${index}: ${formatObject(item)}</div>`;
			}
			return `<div>${index}: ${formattedValue}</div>`;
		})
		.join('');
	return { summary, details };
};
