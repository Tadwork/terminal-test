
			MyApp.directive('jqueryTerminal', function ($compile,$q,compiler) {
			
			return {
				restrict: 'E',
				replace: true,
				template: '<div class="terminal" ><div class="terminal-output" ng-repeat="cmd in out"><span>{{prompt}}</span><code>{{cmd.cmd}}</code><div class="command-output">'
				+ '<div ng-switch on="cmd.type">'
				+	  '<div ng-switch-when="loading"><output-loading/></div>'
				+	  '<div ng-switch-when="error"><output-error />{{cmd.output}}</div>'
				+	  '<div ng-switch-when="success"><output-success />{{cmd.output}}</div>'
				+	  '<div ng-switch-default>{{cmd.output}}</div>'
				+  '</div>'
				+ '</div></div><div class="cmd"></div></div>',
				link: function (scope, elem, attrs) {
				scope.out = [];
				function echo(type,cmd,output){
					scope.$apply(function(){
					var command = {
						type:"loading",
						cmd:cmd,
						output:null
					}
					if(angular.isFunction(cmd)){
						command.cmd = cmd();
					}else{
						$q.when(cmd).then(function(val){
							if(val.cmd) command.cmd = val.cmd;
							else command.cmd = val;
						})
					}
					if(angular.isFunction(type)){
						command.type = type();
					}else{
						$q.when(type).then(function(val){
							if(val.type) command.type = val.type;
							else command.type = val;
						})
					}
					if(angular.isFunction(output)){
						command.output = output();
					}else{
						$q.when(output).then(function(val){
							if(val.output) command.output = val.output;
							else command.output = val;
						})
					}
					
						scope.out.push(command)
					});
					elem[0].scrollTop = elem[0].scrollHeight;
				}
				$(elem).css({ "max-height":  $(elem).parent().height()+ 'px' });
				$(elem).css({ "height":  $(elem).parent().height()+ 'px' });
				$(window).resize(function(){
				$(elem).css({ "max-height":  $(elem).parent().height()+ 'px' });
				$(elem).css({ "height":  $(elem).parent().height()+ 'px' });
				});  
				scope.prompt = '$ ';
					$(elem).find('.cmd').cmd({
					commands:function (cmd) {
						var ret = compiler.cmd(cmd);
						echo(ret.type,ret.cmd,ret.output)
					//if(cmd.length){
					//	return "$ [[;;;code]"+ cmd +"]";
					//}
					//term.echo(cmd);
					},
					prompt: scope.prompt,
					keydown: function(event){
					 if(event.keyCode == 13){
						//	$(elem).find('.cmd').cmd().insert('\n');
					//		term.exec("[[;;;code]"+ term.get_command() +"]")
							//return false;
						}
						
					},
					onCommandChange: function(cmd){
						$(".cmd > div").each(function(i,elem){
							$(elem).css("color","blue");
							});
						elem[0].scrollTop = elem[0].scrollHeight;	
					}
					});
					$(".prompt").next().css("color","red");
					/*$('.cursor').after($compile('<input type="text" name="userName" ng-model="user.name" ng-focus="disable=true" ng-blur="disable=false">')(scope));
					attrs.$observe('disabled', function(value) {
						$(elem).terminal().disable();
						//debugger;
					})*/
//scope.$apply(); 
				}
			};
		}).directive('outputLoading', function () {
			
			return {
				restrict: 'E',
				replace: true,
				template: '<span>loading ...</span>',
				link: function (scope, elem, attrs) {}}
			}).directive('outputError', function () {
			
			return {
				restrict: 'E',
				replace: true,
				transclude:true,
				template: '<span class="output-error"><ng-transclude/></span>',
				link: function (scope, elem, attrs) {}}
			}).directive('outputSuccess', function () {
			
			return {
				restrict: 'E',
				replace: true,
				transclude:true,
				template: '<span class="output-success"><ng-transclude/></span>',
				link: function (scope, elem, attrs) {}}
			});
