import fs from 'fs';

function mapReviver(key : any, value : any) {
	if(typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
		return new Map(value.value);
		}
	}
	return value;
}

function mapReplacer(key : any, value : any) {
	if(value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} else {
		return value;
	}
}

export function LoadMapFromJson<K, V>(path : string) : Map<K, V> {
	if(fs.existsSync(path)) {
		return JSON.parse(fs.readFileSync(path, "utf8"), mapReviver) as Map<K, V>;
	}

	return new Map<K, V>();
}

export function SaveMapToJson(path: string, map : Map<any, any>) {
	fs.writeFileSync(path, JSON.stringify(map, mapReplacer, 4));
}