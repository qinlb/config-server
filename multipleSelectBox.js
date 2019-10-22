(function($) {
	$.fn.MySelect = function(options) {
		var defaults = {
			splitChar : ',', //默认的分隔符
			multiple : false
		//是否多选
		};
		var opt = $.extend({}, defaults, options);
		this
				.each(function() {
					var $box = $(this);
					var $input = $box.find("input.my-select-input"); //输入框
					var $list = $input.next(); //ul装扮成下拉框
					var inputHeight = $input.outerHeight(); //计算input输入框的高度和宽度，方便定位ul和设置ul及包裹元素的宽度
					//var inputWidth=$input.innerWidth();
					$list.css({
						"top" : (inputHeight)
					});
					//$box.width($input.outerWidth());

					var selectArr = document.getElementsByName($input[0].id)[0].value
							.split(",");
					var showArr = [];
					for (var s = 0; s < selectArr.length; s++) {
						for (var l = 0; l < $list.children().length; l++) {
							if (selectArr[s] == $list.children()[l].dataset.value) {
								$($list.children()[l]).addClass("choosed");
								showArr.push( $list.children()[l].innerText.trim());
								break;
							}
						}
					}
					$input[0].value = showArr.join(opt.splitChar);

					$input
							.focus(function() { //输入框获得焦点后，显示下拉选择ul
								var $nextUl = $(this).next();
								if ($nextUl.children().length > 0) {
									$(this).next().show();
								}
							})
							.bind(
									'input propertychange',
									function() { //绑定监测输入框的输入值更改
										var $this = $(this);
										var curText = $this.val();
										var $nextUl = $this.next();
										var $liList = $nextUl.find("li")
												.removeClass("choosed");
										if (!opt.multiple) {//如果是单选
											$this.attr("data-id", "");
											if ($liList.length > 0) {
												$liList
														.each(function(i, item) {
															//                                 var txt=$(item).text();    
															var txt = item.dataset.value;
															if (txt === curText) {
																var v = $(item)
																		.attr(
																				"data-value");
																$this
																		.attr(
																				"data-id",
																				v);
																$(item)
																		.addClass(
																				"choosed");
															}
														});
											}
										} else { //如果是多选
											var inputValArr = curText ? curText
													.split(opt.splitChar) : [];
											if (inputValArr.length > 0) {
												var hash = [];
												for (var i = 0; i < inputValArr.length; i++) {
													var txtItem = inputValArr[i];
													if (hash.indexOf(txtItem) == -1) {
														hash.push(txtItem);
													}
												}
												inputValArr = hash;
												$this.val(hash
														.join(opt.splitChar));
												document
														.getElementsByName($this[0].id)[0].value = hash
														.join(opt.splitChar);
												for (var i = 0; i < inputValArr.length; i++) {
													var txtItem = inputValArr[i];
													if (txtItem != 'All'
															&& txtItem != '') {
														if ($liList.length > 0) {
															$liList
																	.each(function(
																			i,
																			item) {
																		//                                         var txt=$(item).text();
																		var txt = item.dataset.value;
																		var valueArray = document
																				.getElementsByName(item.parentElement.previousElementSibling.id)[0].value
																				.split(',');
																		if (txt === txtItem) {
																			//var v=$(item).attr("data-value");
																			//$this.attr("data-id",v);
																			for (var re = 0; re < valueArray.length; re++) {
																				if (valueArray[re] == 'All') {
																					valueArray
																							.splice(
																									re,
																									1);
																					re--;
																					break;
																				}
																			}
																			for (var re = 0; re < valueArray.length; re++) {
																				if (valueArray[re] == '') {
																					valueArray
																							.splice(
																									re,
																									1);
																					re--;
																					break;
																				}
																			}
																			for (var re = 0; re < valueArray.length; re++) {
																				if (valueArray[re] == txtItem) {
																					valueArray
																							.splice(
																									re,
																									1);
																					re--;
																					break;
																				}
																			}
																			valueArray
																					.push(txt);
																			document
																					.getElementsByName(item.parentElement.previousElementSibling.id)[0].value = valueArray
																					.join(opt.splitChar);
																			$(
																					item)
																					.addClass(
																							"choosed");
																		}
																	});
														}
													}
												}
											}
										}
									});
					//修改成如下事件绑定，为了给动态添加的li也可以产生点击效果
					$list
							.off('click', 'li')
							.on(
									'click',
									'li',
									function(e) {
										var $this = $(this);
										var value = $this.attr("data-value")
												|| '';
										if (!opt.multiple) { //如果是单选
											$input.val($this.text()).attr(
													"data-id", value);
											$this.addClass("choosed")
													.siblings().removeClass(
															"choosed");
											$this.parent().hide(); //隐藏ul
										} else { //如果是多选的情况下,单击li项时,情形一：li项的text已经在输入框中,情形二:li项的text不在输入框中
											//正则表达式去判断li的text是否在输入框中
											var curInputVal = $input.val();
											var inputValArr = curInputVal ? curInputVal
													.split(opt.splitChar)
													: [];
											var liText = $this.text().trim();
											//^abc$|^abc\||\|abc\||\|abc$
											//                         var regStr='';
											//                         if(opt.splitChar==="|" ||opt.splitChar==="$"){  //如果分隔符是特殊字符要进行转义
//											var regStrAll = "^All$|^All\\"
//													+ opt.splitChar + "|\\"
//													+ opt.splitChar + "All\\"
//													+ opt.splitChar + "|\\"
//													+ opt.splitChar + "All$";
//											//                         }else{
//											var regStrEmp = "^<Empty>$|^<Empty>\\"
//													+ opt.splitChar
//													+ "|\\"
//													+ opt.splitChar
//													+ "<Empty>\\"
//													+ opt.splitChar
//													+ "|\\"
//													+ opt.splitChar
//													+ "<Empty>$";
											//                         }                           
											//                         //console.log("正则串",regStr);
											//                         var reg=new RegExp(regStr);
//											var regAll = new RegExp(regStrAll);
//											var regEmp = new RegExp(regStrEmp);
											var regStrTx = "^"+liText+"$|^"+liText+",|,"+liText+",|,"+liText+"$";
											var regText = new RegExp(regStrTx);
											var valueArray = document
													.getElementsByName($input[0].id)[0].value
													.split(opt.splitChar);
											if (regText.test(curInputVal)) {//说明当前li的值已经在input中存在,此时把li项移除
												if (inputValArr.length > 0) {
													for (var m = 0; m < inputValArr.length; m++) {
														if (inputValArr[m] == liText) {
															inputValArr.splice(
																	m, 1);
															valueArray.splice(
																	m, 1);
															m--;
															//break;
														}
													}
												}
												$this.removeClass("choosed");
												if (inputValArr.length == 0) {
													inputValArr.push($this.parent().children()[0].innerText.trim());
													valueArray.length == 0;
													valueArray.push($this.parent().children()[0].dataset.value);
													$(
															$this.parent()
																	.children()[0])
															.addClass("choosed");
												}
											} else {//如果不在输入框中,则把该项
												if (liText != 'All' && liText != 'ALL'
														&& liText != '<Empty>') {
													if (inputValArr.length > 0) {
														for (var m = 0; m < inputValArr.length; m++) {
															if (inputValArr[m] == "All" || inputValArr[m] == "ALL"
																	|| inputValArr[m] == "<Empty>") {
																inputValArr
																		.splice(
																				m,
																				1);
																break;
															}
														}
														for (var n = 0; n < valueArray.length; n++) {
															if (valueArray[n] == 'All' || valueArray[n] == 'ALL'
																	|| valueArray[n] == "") {
																valueArray
																		.splice(
																				n,
																				1);
																break;
															}
														}
													}
													for(var chi=0;chi<$this.parent().children().length;chi++){
														var li_value = $this.parent().children()[chi].dataset.value;
														if(li_value == 'All' || li_value == 'ALL' || li_value == ""){
															$($this.parent().children()[chi]).removeClass("choosed");
														}else{
															break;
														}
													}
												} else {
													for (var j = 0; j < valueArray.length; j++) {
														for (var i = 0; i < $this
																.parent()
																.children().length; i++) {
															if ($this.parent()
																	.children()[i].dataset.value == valueArray[j]) {
																$(
																		$this
																				.parent()
																				.children()[i])
																		.removeClass(
																				"choosed");
																break;
															}
														}
													}
													inputValArr.length = 0;
													valueArray.length = 0;
												}
												inputValArr.push($this.text()
														.trim());
												valueArray.push(value);
												$this.addClass("choosed");
											}
											if (liText == 'All' || liText == 'ALL'
													|| liText == '<Empty>') {
												inputValArr = liText
														.split(opt.splitChar);
											}
											$input.val(inputValArr
													.join(opt.splitChar));

											document
													.getElementsByName($input[0].id)[0].value = valueArray
													.join(opt.splitChar);

										}
									});
				});

		$(document).click(function(e) { //点击.my-select-box范围外时隐藏ul下拉框
			var target = e.target;
			var $target = $(target);
			var $parent = $target.closest('.my-select-box');
			if ($parent.length < 1) { //说明不是.my-select-box范围内点击，将ul隐藏
				$(".my-select-list").hide();
			} else if ($parent.length == 1) { //如果存在多个my-select-box的情况，将其余的非这项以外的都隐藏
				var $ul = $parent.find(".my-select-list");
				var flag = $parent.is(":hidden");
				$(".my-select-list").hide();
				if (!flag)
					$ul.show();
			}
		});
		return this;
	}
})(jQuery);

$(".my-select-box").MySelect({
	multiple : true
});
$("#single").MySelect();