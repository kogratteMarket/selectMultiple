(function($) {
    $.selectMultiple = {version: '1.0'};
    $.fn.extend({
		selectMultiple: function(options)
		{
		    var defaults =
		    {
				morePic: 'css/images/skills_more.png',
				lessPic: 'css/images/skills_less.png',
				width : 'ajust',
				height : 'clone',
				beforeTransform: false,
				afterTransform: false,
				displayOptOnDisabledItem: false
		    };
		    var opts = $.extend(defaults, options);
		    
		    $(document).trigger('beforeTransform');

		    $(this).each(function()
		    {
		    	originalSelect		= $(this);
				originalSelectName	= originalSelect.attr('name');
	            originalSelectDisabled	= originalSelect.is(':disabled');

				if (typeof opts.beforeTransform == 'function')
					opts.beforeTransform(originalSelect);

		    	newSelect = $(document.createElement('div'));
	            newSelect.addClass(originalSelect.attr('class') + ' multipleSelect').removeClass('select');

		    	if (opts.height == 'clone')
		    	{
			    	newSelect.css('height', originalSelect.css('height'));
			    }
		    	else if (opts.height != 'css')
		    	{
			    	newSelect.css('height', opts.height);
			    }

				if (opts.width && opts.width != 'ajust')
				{
				    newSelect.css('width', opts.width);
				}

				/*
				* Then, insert the new select after the replaced item. Maybe not optimized!
				*/

				var optGroupStarted = false;
				var current_optGroup = false;
				nwidth = 0;
				i = 1;
				idBase = originalSelectName.substr(0, originalSelectName.length - 2);

				$('*', originalSelect).each(function()
				{
				    $_originalSelectItem		    = $(this);
				    $_originalSelectItemIsSelected   = $_originalSelectItem.is(':selected');
				    $_originalSelectItemName	    = $_originalSelectItem.attr('name');
				    
				    $_itemLine = $(document.createElement('div')).css('width', '100%');
				    
				    $_itemID = idBase + i;
				    
				    /*
				     * If an optgroup is started and finish now
				     */
				    if (optGroupStarted && $_originalSelectItem.context.parentNode.nodeName != 'OPTGROUP')
				    {
						optGroupStarted = false;
						insideCheckedOptGroup = current_optGroup.find('.inOptGroup:checked');
						insideOptGroup = current_optGroup.find('.inOptGroup');
						
						if (insideCheckedOptGroup.size())
						{
						    optGroupDisplayButton = current_optGroup.find('.optGroupDisplay');
						    
						    if (insideCheckedOptGroup.size() == insideOptGroup.size())
						    {				
								optGroupDisplayButton
							    	.removeClass('semiselected')
							    	.addClass('selected');
								optGroupDisplayButton.find('.optGroupCheck').attr('checked', 'checked');
						    }
						    else
						    {
								optGroupDisplayButton.addClass('semiselected');
						    }
						}
						/* This is the end of the inside item collections, so we're adding now the currentOptGroup to his containing line, not before! */
						current_optGroup.appendTo(newSelect);
				    } // Endif
				    
				    
				    switch ($_originalSelectItem[0].nodeName)
				    {
						case 'OPTION':
						    if ($_originalSelectItemIsSelected)
						    {
								$_itemLine.addClass('selected');
						    }

						    $_itemLine.addClass('nOption');

						    checkbox = $(document.createElement('input')).attr({
								'type': 'checkbox',
								'checked' : $_originalSelectItemIsSelected,
								'name' : $_originalSelectItemName && (typeof $_originalSelectItemName != 'undefined') ? $_originalSelectItemName : originalSelectName,
								'value' : $_originalSelectItem.val(),
								'id' : $_itemID,
								'disabled' : originalSelectDisabled
						    });
						    

						    span = $(document.createElement('label')).attr('for', $_itemID).html($_originalSelectItem.html());
						    
						    /*
						     * If we have a started optGroup, then, add the line inside!
						     */
						    if (optGroupStarted)
						    {
								checkbox
								    .addClass('inOptGroup')
								    .appendTo($_itemLine);
								    
								span.appendTo($_itemLine);
								$_itemLine.appendTo(current_optGroup);
						    }
						    else
						    {
								checkbox.appendTo($_itemLine);
								span.appendTo($_itemLine);
								$_itemLine.appendTo(newSelect);
						    }
						break;

						case 'OPTGROUP':
						    optGroupStarted = true;
						    current_optGroup = $(document.createElement('div')).addClass('optGroupList');

						    optGroupLibelleContainer = $(document.createElement('div')).addClass('optGroupDisplay');
						    
						    checkbox = $(document.createElement('input')).attr({
								'type': 'checkbox',
								'checked' : $_originalSelectItemIsSelected,
								//'value' : $_originalSelectItem.val(),
								'id' : $_itemID,
								'disabled' : originalSelectDisabled
						    }).addClass('optGroupCheck');
						    
						    checkbox.appendTo(optGroupLibelleContainer);

						    img = $(document.createElement('img')).attr('src', opts.morePic).addClass('subOptions');

						    var optgroupLibelle = $(document.createElement('label'))
								.attr('for', $_itemID)
								.css('font-weight', 'bold')
								.html($_originalSelectItem.attr("label"));

						    img.appendTo(optGroupLibelleContainer);

						    optgroupLibelle.appendTo(optGroupLibelleContainer);
						    optGroupLibelleContainer.appendTo(current_optGroup);
						break;
				    }
				   
				    i++;
				}); // End each
				/*
				 * If an optgroup is opened and is the first & last item, then we never close it and append it to the container
				 */
				if (optGroupStarted)
				{
				    optGroupStarted = false;
				    insideCheckedOptGroup = current_optGroup.find('.inOptGroup:checked');
				    insideOptGroup = current_optGroup.find('.inOptGroup');

				    if (insideCheckedOptGroup.size())
				    {
						optGroupDisplayButton = current_optGroup.find('.optGroupDisplay');

						if (insideCheckedOptGroup.size() == insideOptGroup.size())
						{				
						    optGroupDisplayButton
								.removeClass('semiselected')
								.addClass('selected');
						    optGroupDisplayButton.find('.optGroupCheck').attr('checked', 'checked');
						}
						else
						{
						    optGroupDisplayButton.addClass('semiselected');
						}
				    }
				    /* This is the end of the inside item collections, so we're adding now the currentOptGroup to his containing line, not before! */
				    current_optGroup.appendTo(newSelect);
				} // End if
				
				newSelect.find('.optGroupList div:not(.optGroupDisplay)').hide();
				
				if (!newSelect.find('.optGroupList div:not(.optGroupDisplay) input[type=checkbox]:not(:checked)').size() && newSelect.find('.optGroupList div:not(.optGroupDisplay) input[type=checkbox]').size()) {
				    newSelect.find('.optGroupList div.optGroupDisplay input[type=checkbox]').attr('checked', 'checked');
				}

				originalSelect.replaceWith(newSelect);

				optimalWidth = Math.max.apply(Math, newSelect.find('label').map(function(){
					if (typeof $.actual !== 'undefined')
				    	return $(this).actual('width', { 'clone' : true});
				    return $(this).width();
				}).get());
				
				if (optimalWidth > nwidth) {
				    nwidth = optimalWidth;
				}
				if (opts.width == 'ajust') {
				    newSelect.css('width', nwidth + 60);
				}

				if (typeof opts.afterTransform == 'function')
					opts.afterTransform(newSelect);

				/*
				 * Binding click
				 */
				if (!originalSelectDisabled)
				{
				    newSelect.find('input[type=checkbox]').unbind('click').click(function()
				    {
						$this = $(this);
						$thisClosestDiv = $this.closest('div');
						$thisClosestOptgroup = $this.closest('.optGroupList');
						
						if ($this.is(':checked'))
						{
						    $thisClosestDiv.addClass('selected');
						    if ($this.hasClass('inOptGroup'))
						    {
							if ($thisClosestOptgroup.find('.inOptGroup:checked').size() == $thisClosestOptgroup.find('.inOptGroup').size())
							{
							    $thisClosestOptgroup.find('.optGroupDisplay')
									.removeClass('semiselected')
									.addClass('selected')
								.find('input.optGroupCheck')
								    .attr('checked', 'checked');
							}
							else
							{
							    $thisClosestOptgroup.find('.optGroupDisplay').addClass('semiselected');
							}
						    }
						}
						else
						{
						    $thisClosestDiv.removeClass('selected');
						    
						    if ($this.hasClass('inOptGroup'))
						    {
								$thisClosestOptgroup.find('.optGroupDisplay')
								    .removeClass('selected')
								    .find('input[type=checkbox]')
									.removeAttr('checked');

								if ($thisClosestOptgroup.find('.inOptGroup:checked').size())
								    $thisClosestOptgroup.find('.optGroupDisplay').addClass('semiselected');
								else
								    $thisClosestOptgroup.find('.optGroupDisplay').removeClass('semiselected');
							}
					    }
					}); // End click

					newSelect.find(".optGroupCheck").click(function() {

					    if (this.checked)
					    {
							$(this).closest("div.optGroupList").find("input[type=checkbox]").attr("checked", "checked").closest("div").addClass("selected");
							$(this).closest("div").removeClass("semiselected").addClass("selected");
					    }
					    else
					    {
							$(this).closest("div.optGroupList").find("input[type=checkbox]").removeAttr("checked").closest("div").removeClass("selected");
							$(this).closest("div").removeClass("selected");
					    }
					}); // End click

					newSelect.find(".subOptions").click(function(e) {
					    e.stopImmediatePropagation();
					    
					    if ($(this).closest("div").next().is(":visible"))
					    {
							$(this).attr("src", opts.morePic);
							$(this).closest(".optGroupList").find("div:not(.optGroupDisplay)").slideUp("fast");
					    }
					    else
					    {
							$(this).attr("src", opts.lessPic);
							$(this).closest(".optGroupList").find("div:not(.optGroupDisplay)").slideDown("fast");
					    }
					}); // End click
				}
				else /* On ajoute un return si l'item est désactivé */
				{
					if (opts.displayOptOnDisabledItem)
					{
						newSelect.find(".subOptions").click(function(e) {
						    e.stopImmediatePropagation();
						    
						    if ($(this).closest("div").next().is(":visible"))
						    {
								$(this).attr("src", opts.morePic);
								$(this).closest(".optGroupList").find("div:not(.optGroupDisplay)").slideUp("fast");
						    }
						    else
						    {
								$(this).attr("src", opts.lessPic);
								$(this).closest(".optGroupList").find("div:not(.optGroupDisplay)").slideDown("fast");
						    }
						});
					}
					else
					{
						newSelect.click(function() { return false; });	
					}
				    
				}
			}); // End each
		} // End function
    });
})(jQuery);
