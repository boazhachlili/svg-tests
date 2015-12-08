dna = "TGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATTAACACCGTGCGTGTTGACTATTTTACCTCTGGCGGTGATAATGGTTGCTGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATATGGTGTCGAAAGGGGAGGAATTGTTCACCGGAGTTGTGCCTATCTTAGTCGAATTAGATGGTGATGTGAACGGCCATAAATTTAGCGTAAGCGGGGAAGGTGAAGGTGATGCGAC";
// dna = "111222333444555666777888999000111222333444555666777888999000111222333444555666777888999000111222333444555666777888999000111222333444555666777888999000111222333444555666777888999000";


colors = ['#FFFB00', '#EFE33B', '#DED800', '#F7F19C', '#3234FF', '#BFC0FF', '#383BFF', '#DFDFFF', '#57FF16', '#99FF72', '#43F000', '#CCFFB8', '#A3006C', '#FB9FDC', '#CC0087', '#FDD6F0', '#42FFDF', '#77FFE8', '#27EAC9', '#BAFFF4', '#6B6A00', '#DBDA8A', '#D0C600', '#EDECC4', '#BE002D', '#FFBFCE', '#FF668B', '#FFDFE6', '#ECECEC', '#D6D4A3', '#CFCEB0', '#EBE9D1', '#00620A', '#7EDD93', '#009722', '#C6F0D0', '#FFD5A1', '#FFCC8D', '#FFC984', '#FFE5C6'];
rowHeight = 10;
brickWidth = 30;
svgxmlns = "http://www.w3.org/2000/svg"

window.tspan = document.getElementById('tspan');
	
var config = {
	useBricks: false
};


function init() {
	var sequenceContainer = document.getElementById('svgRow'),
		brickWidth = getBrickWidth(3),
		brickHeight = 10,
		charWidth = getCharWidth(),
		charsPerRow = getCharsPerRow(charWidth),
		rowWidth = charsPerRow * charWidth,
		totalRows = 1;//dna.length / charsPerRow;
		
	console.info('charsPerRow: '+charsPerRow);
	console.info('charWidth: '+charWidth);
	console.info('brickWidth: '+brickWidth);
	console.info('brickHeight: '+brickHeight);
	console.info('totalRows: '+totalRows);
	console.info('rowWidth: '+rowWidth);

	for (var rowIndex = 0; rowIndex < totalRows; rowIndex++) {
		tspan.textContent = dna.substr(rowIndex, charsPerRow);
		var startCharAt = rowIndex * charsPerRow;

		var rowData = dna.substr(startCharAt, charsPerRow),
			svgRow = sequenceContainer, //createSvgRow(rowIndex, rowHeight),
			totalChars = rowData.length;

		// draw all bricks on a single path:
		var	sequencePart = new SequencePart({
			container: sequenceContainer,
			svgRow: svgRow,
			rowWidth: rowWidth,
			rowData: rowData,
			brickWidth: brickWidth, //TODO: this should be private to SequencePart
			brickHeight: brickHeight,
			color: colors[rowIndex % colors.length],
			startChar: 0,
			direction: 'LTR'
		});

		sequencePart.draw();
	}
}

function SequencePart(params) {
	var container = params.container,
		svgRow = params.svgRow,
		rowWidth = params.rowWidth,
		rowData = params.rowData,
		brickWidth = params.brickWidth,
		brickHeight = params.brickHeight,
		color = params.color,
		startX = getStartX(params.startChar),
		direction = params.direction;

	svgRow.setAttribute('width', rowWidth+'px');

	function getStartX(startChar) {
		return startChar * charWidth;
	}

	function toPolygon(direction) {
		var polygon = document.createElementNS(svgxmlns, 'polygon');
		var points = {
			ltr: [ 
				[startX, 5],
				[startX+5, 0],
				[startX+width+5, 0],
				[startX+width, 5],
				[startX+width+5, 10],
				[startX+5, 10]
			],
			rtl: [
				[startX, 5],
				[startX-5, 0],
				[startX-width-5, 0],
				[startX-width, 5],
				[startX-width-5, 10],
				[startX-5, 10]
			]
		};
		polygon.setAttribute('points', points[direction].join(' '));
		polygon.setAttribute('fill', color);
		polygon.setAttribute('stroke', '#333');
		polygon.setAttribute('style', 'opacity: 0.25;'); 
		return polygon;
	}

	function toPath(direction) {
		var path = document.createElementNS(svgxmlns, 'path');
		direction = direction.toUpperCase();
		path.setAttribute('fill', color);
		path.setAttribute('stroke', '#333');
		// path.width = '900px';
		var d = '';
		//var xIncrement = brickHeight / 2 * direction;

		var totalTriplets = Math.floor(rowData.length / 3);
		var remainingChars = rowData.length % 3;

		for(var i = 0; i < totalTriplets; i++) {
			if(direction == 'LTR') {
				// d += ' ' + ['M', startX, 0, 'l', brickWidth, 0, 'l', 0, 10, 'l', -brickWidth, 0, 'Z'].join(' ');
				d += ' ' + ['M', startX+5, 5, 'l', -5, -5, 'l', brickWidth, 0, 'l', 5, 5, 'l', -5, 5, 'l', -brickWidth, 0, 'Z'].join(' ');
			}
			else {
				// d += ' ' + ['M', startX, 0, 'l', brickWidth, 0, 'l', 0, 10, 'l', -brickWidth, 0, 'Z'].join(' ');
				d += ' ' + ['M', startX, 5, 'l', 5, -5, 'l', brickWidth, 0, 'l', -5, 5, 'l', 5, 5, 'l', -brickWidth, 0, 'l', -5, -5, 'Z'].join(' ');
			}

			startX += brickWidth;
		}

		path.setAttribute('d', d);
		if(remainingChars) {
			brickWidth = remainingChars * charWidth;
			if(direction == 'LTR') {
				d += ' ' + ['M', startX+5, 5, 'l', -5, -5, 'l', brickWidth, 0, 'l', 5, 5, 'l', -5, 5, 'l', -brickWidth, 0, 'Z'].join(' ');
				// d += ' ' + ['M', startX, 0, 'l', brickWidth, 0, 'l', 0, 10, 'l', -brickWidth, 0, 'Z'].join(' ');
			}
			else {
				d += ' ' + ['M', startX, 5, 'l', 5, -5, 'l', brickWidth, 0, 'l', -5, 5, 'l', 5, 5, 'l', -brickWidth, 0, 'l', -5, -5, 'Z'].join(' ');
				// d += ' ' + ['M', startX, 0, 'l', brickWidth, 0, 'l', 0, 10, 'l', -brickWidth, 0, 'Z'].join(' ');
			}
			
			path.setAttribute('d', d)
		}
		svgRow.appendChild(path);
	}

	function draw() {
		toPath('ltr');
	}

	return {
		draw: draw,
		toPath: toPath,
		toPolygon: toPolygon
	};
}

function createSvgRow(i, height) {
	var svg = document.createElementNS(svgxmlns, 'svg');
	svg.setAttribute('id', 'svg'+i);
	svg.setAttribute('style', 'height: '+height+'px; width: 100%;');
	svg.setAttribute('xmlns', svgxmlns);
	svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

	// return document.getElementById('svgRow');
	return svg;
}

function isOverflow(charWidth, letterSpacing) {
	var textLength, containerLength;
	// textLength = Math.floor(tspan.getComputedTextLength());
	textLength = Math.ceil(tspan.getBBox().width+charWidth+letterSpacing);
	// containerLength = document.getElementById('svgRow').clientWidth;
	containerLength = document.getElementById('helper').clientWidth;
	console.log(textLength , containerLength);
	return textLength >= containerLength;
}

function getCharsPerRow(charWidth) {
	tspan.textContent='';
	letterSpacing = 1; //TODO: get letter-spacing from element attribute
	var max = 1000;
	for(var i = 0; i < max; i++) {
	    tspan.textContent += 'A';
	    if(isOverflow(charWidth, letterSpacing)) {
	    	return i+1;
		}
	}
}

function getCharWidth() {
	tspan.textContent = 'A';
	window.charWidth = tspan.getBBox().width
	return window.charWidth;
}

function getBrickWidth(n) {
	tspan.textContent = '';
	
	for(var i = 0; i < n; i++) {
		tspan.textContent += 'A';
	}

	var width = tspan.getBBox().width + 1;
	return width;
}

init();