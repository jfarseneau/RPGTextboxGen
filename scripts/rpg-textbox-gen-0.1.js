/*!
/* RPG Textbox Generator 0.1
/*
/* "THE LUNCH-WARE LICENSE" (Revision 1)
/* Jean-Francois Arseneau <jf.arseneau@gmail.com> wrote this file. As long as you
/* retain this notice you can do whatever you want with this stuff. This license 
/* is a fork of Poul-Henning Kamp's beer-ware license. I don't drink,
/* but I love all kinds of food. If we meet some day, and you think this stuff
/* is worth it, you can buy me lunch in return.
/*
*/

$('document').ready(function() {
	function get()
	{
		var vars = {};
    	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
    	{
    		vars[key] = value;
    	});
    	
    	return vars;
	}

	function renderTextbox()
	{
		var characterName = $('#characterName').val();
		var textToRender = $('#dialogText').val();
		var maxCharPerLine = 32;
		var maxLines = 4;

		if (characterName != '' && characterName != undefined)
			characterName = characterName.toUpperCase()+': ';
		else
			characterName = '';

		var inputData = textToRender;


		// Split the content to fit in the box
		var content = new Array();
		if (characterName != undefined)
			content[0] = characterName;

		// Seperate only at a word boundary.
		var splice = '';
		words = inputData.split(" ");
		var currentLine = 0;
		for (i=0; i<words.length; i++)
		{
			var word = words[i]+' ';

			// Transform newline into new lines for canvas.
			if (/\n/.test(word))
			{
				characters = word.split('');

				$.each(characters, function(index,character)
				{
					if (character == '\n')
					{
						currentLine++;
						content[currentLine] = '';
					}
					else
					{
						content[currentLine] += character;
					}

				});
			}
			else
			{
				// Add to existing line, or create a new one if it exceeds the length
				if ( (content[currentLine]+word).length < maxCharPerLine )
				{
					 content[currentLine] += word;
				}
				else
				{
					currentLine++;
					content[currentLine] = word;
				}
			}
		}

		var context = document.getElementById('textbox').getContext('2d');
		var bg = new Image();
		bg.src = 'images/ff6_bg.png';
		bg.onload = function() {
			context.drawImage(bg,0,0,1135,340);

			context.font = "116px FinalFantasyVISNESbRegular";

			var baseX = 60;
			var baseY = 78;
			var shadowOffset = 4;
			var lineSpacing = 65;

			$.each(content, function(index, line) {
				if (index < maxLines)
				{
					var adjustedY = (baseY)+(index*lineSpacing);

					// Text Shadow
					context.fillStyle = '#000000';
					context.fillText(line, baseX+shadowOffset, adjustedY+shadowOffset);

					// Text
					context.fillStyle = '#FFFFFF';
					context.fillText(line, baseX, adjustedY);
				}
			});		
		}
	}

	$('#characterName').keyup(function() {
	 	renderTextbox();
	});

	$('#dialogText').keyup(function() {
	 	renderTextbox();
	});


	// Preselect fields from GET values
	urlGet = get();
	if (urlGet.characterName != undefined)
		$('#characterName').val(decodeURIComponent(urlGet.characterName));

	if (urlGet.dialogText !=  undefined)
		$('#dialogText').val(decodeURIComponent(urlGet.dialogText));

	if (urlGet.rpgStyle)
		$('#rpgStyle').val(decodeURIComponent(urlGet.rpgStyle));

	renderTextbox();
});


