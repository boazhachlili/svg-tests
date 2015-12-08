function isOverflow() {
	var textLength, containerLength;
	textLength = tspan.getComputedTextLength();
	containerLength = document.getElementById('svgRow').clientWidth;

	return textLength > containerLength;
}

function getCharsPerRow(maxChars) {
	tspan.textContent='';
	maxChars = maxChars || 100;

	for(var i = 0; i < maxChars; i++) {
	    if(isOverflow()) {
	    	break;
		}
	    tspan.textContent += dna.substr(i, 1);
	}

	return document.getElementById('svgRow').childNodes[1].textContent.length-1;
}

function getBrickWidth(n) {
	tspan.textContent = '';

	for(var i = 0; i < n; i++) {
		tspan.textContent += 'A';
	}
	
	return tspan.getComputedTextLength();	
}

function addBrick(size, type, path) {

}

function addRows(sequence) {

}

function addRow(start, end, sequence) {
	var sgvRow = document.getElementById('svgRow').childNodes[1].textContent = sequencePart;
	// svg.appendChild(document.)
	// drawFeatures(sequencePart, );
	console.log('row width pixel', tspan.getComputedTextLength());
}

// function parseSequence(sequence) {
	// var sequence = sequence.split('').map(function(char, index, dna) {
	// 	return {
	// 		char: char,
	// 		index: index
	// 	};
	// });

	// return sequence;
// }

function main() {
	window.dna = "TGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATTAACACCGTGCGTGTTGACTATTTTACCTCTGGCGGTGATAATGGTTGCTGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTCACACAGGAAAGTGCTTTTGTACTTACACTTGATGCCCAAGAAAATGGACGTTGCTAACAAGCCCATACAGACCACACCTCGAGATAACTTCGTATAATGTATATGGTGTCGAAAGGGGAGGAATTGTTCACCGGAGTTGTGCCTATCTTAGTCGAATTAGATGGTGATGTGAACGGCCATAAATTTAGCGTAAGCGGGGAAGGTGAAGGTGATGCGAC";
	window.tspan = document.getElementById('svgRow').childNodes[1];

	var charsPerRow = getCharsPerRow(),
		brickWidth = getBrickWidth(3);

	console.info('chars per row: '+charsPerRow);
	console.info('brick width in px: '+brickWidth);

	var i = 0;
	
	while(i+charsPerRow < sequence.length) {
		addRow(i, i + charsPerRow, sequence);
		i += charsPerRow;
	}

}

main();