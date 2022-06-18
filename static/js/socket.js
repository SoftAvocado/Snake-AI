jQuery(function(){
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Recieve coordinates from server and draw the game
    socket.on('getCoords', data=>{
        const cb = document.querySelector("#cbLearnPlay");
        let canvas_ = 0;
        let ctx_ = 0;
        let snakeParts_ = 0;
        let applePosition_ = 0;
      
        if (cb.checked)
        {
          // Game mode
          canvas_ = document.getElementById("game_window_intro2");
          ctx_ = canvas_.getContext("2d");
          snakeParts_ = data.data_pp; 
          applePosition_ = data.data_fp;
          run(ctx_, canvas_, snakeParts_, applePosition_);
  
          gp_game = document.getElementById("gp_game_intro2");
          gp_step = document.getElementById("gp_step_intro2");
          gp_score = document.getElementById("gp_score_intro2");
          gp_max = document.getElementById("gp_max_intro2");
        }
        else 
        {
          // Train mode
          canvas_ = document.getElementById("game_window");
          ctx_ = canvas_.getContext("2d");
          snakeParts_ = data.data_pp; 
          applePosition_ = data.data_fp;
          run(ctx_, canvas_, snakeParts_, applePosition_);
  
          gp_game = document.getElementById("gp_game");
          gp_step = document.getElementById("gp_step");
          gp_score = document.getElementById("gp_score");
          gp_max = document.getElementById("gp_max");
        };
        gp_game.value = data.data_game;
        gp_step.value = data.data_step;
        gp_score.value = data.data_score;
        gp_max.value = data.data_max;
    });
  
    // Recieve only statistics from server and display them
    socket.on('getOnlyStats', data=>{
      const cb = document.querySelector("#cbLearnPlay");
      if (cb.checked)
      {
        // Game mode
        gp_game = document.getElementById("gp_game_intro2");
        gp_step = document.getElementById("gp_step_intro2");
        gp_score = document.getElementById("gp_score_intro2");
        gp_max = document.getElementById("gp_max_intro2");
  
        gp_game.value = data.data_game+1;
        gp_step.value = data.data_step;
        gp_score.value = data.data_score;
        gp_max.value = data.data_max;
      }
      else 
      {
        // Train mode
        gp_game = document.getElementById("gp_game");
        gp_step = document.getElementById("gp_step");
        gp_score = document.getElementById("gp_score");
        gp_max = document.getElementById("gp_max");
  
        gp_game.value = data.data_game+1;
        gp_step.value = data.data_step;
        gp_score.value = data.data_score;
        gp_max.value = data.data_max;
      };
    });
    
    // Recieve message from server
    socket.on('message', data=>{
      console.log("Message: "+data);

      // Create result section with generated picture 
      if (data=="Picture generated."){
          console.log('Got the picture!');
          const cb = document.querySelector("#cbLearnPlay");
          if (cb.checked)
          {
              // Game mode
              console.log("plot1 loading");
              $("#result__pic_intro2").attr("src", "../static/plots/plot1.png"+ '?' + (new Date()).getTime());
              window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#result2";
              $('#result2').show();
  
              if ($('#start__btn_intro2').hasClass('stop_game')){
                $('#start__btn_intro2').removeClass( "stop_game" );
                $('#start__btn_intro2').val("Начать игру");
              }
              $('#start__btn_intro2').removeClass("nonactive");
              clear_validation_intro2();
          }
          else 
          {
              // Train mode
              $("#result__pic").attr("src", "../static/plots/plot0.png"+ '?' + (new Date()).getTime());
              window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#result1";
              $('#result1').show();
  
              if ($('#start__btn').hasClass('stop_game')){
                $('#start__btn').removeClass( "stop_game" );
                $('#start__btn').val("Начать обучение");
              }
              $('#start__btn').removeClass("nonactive");
              clear_validation();
          };
      }

      // Update weights path with generated path
      if ((data[data.length-3]==".")&&(data[data.length-2]=="h")&&data[data.length-1]=="5"){
          console.log(weights_path);
          weights_path = "static/weights/"+data;
          console.log(weights_path);
      }

      // Hide result section if no plot was generated
      if (data=="Not enough data for plot."){
        const cb = document.querySelector("#cbLearnPlay");
        if (cb.checked)
        {
            // Game mode
            $('#result1').hide();
            $('#result2').hide();
            if ($('#start__btn_intro2').hasClass('stop_game')){
              $('#start__btn_intro2').removeClass( "stop_game" );
              $('#start__btn_intro2').val("Начать игру");
            }
            $('#start__btn_intro2').removeClass("nonactive");
            clear_validation_intro2();
        }
        else 
        {
            // Train mode
            $('#result1').hide();
            $('#result2').hide();
            if ($('#start__btn').hasClass('stop_game')){
              $('#start__btn').removeClass( "stop_game" );
              $('#start__btn').val("Начать обучение");
            }
            $('#start__btn').removeClass("nonactive");
            clear_validation();
        };
        switch_games_displays();
    }
    });
  
    // Send server the message to stop the game
    $(document).on('click', '.stop_game', function(e) {
      if (!(($('#start__btn_intro2').hasClass('nonactive'))||($('#start__btn').hasClass('nonactive')))){
        const cb = document.querySelector("#cbLearnPlay");
        if (cb.checked)
        {
            // Game mode
            $('#start__btn_intro2').addClass("nonactive");
            console.log("start__btn_intro2 non active? "+$('#start__btn_intro2').hasClass('nonactive'))
            
        }
        else 
        {
            // Train mode
            $('#start__btn').addClass("nonactive");
            console.log("start__btn non active? "+$('#start__btn').hasClass('nonactive'))
        }
        socket.send('Stop game.');
        console.log("Message sent: Stop game.")
      }
    });
  
    // Switch between Learning and Playing sections
    $(document).on('click', '#cbLearnPlay', function(e) {
      const cb = document.querySelector("#cbLearnPlay");
      if (cb.checked)
      {
          // Game mode
          if ($('#start__btn').hasClass('stop_game')){
              //alert("Вы уверены, что хотите прервать обучение?")
              cb.checked = false; 
              Swal.fire({
                  title: 'Вы уверены, что хотите прервать обучение?',
                  showDenyButton: false,
                  showCancelButton: true,
                  confirmButtonColor: 'rgb(137, 184, 10)',
                  confirmButtonText: 'Да, переключиться в режим Игра',
                  cancelButtonText:'Отмена',
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                      // Остановить алгоритм
                      socket.send('Stop game. No plot.');
                      cb.checked = true;
                      $("#intro1").hide();
                      $("#intro2").show();
                      $('#result1').hide();
                      $('#result2').hide();
  
                      $('#start__btn').removeClass( "stop_game" );
                      $('#start__btn').val("Начать обучение");
                      if ($('#start__btn').hasClass('nonactive')){
                        $('#start__btn').removeClass("nonactive");
                      }
                  }
                })
          }
          else{
              $("#intro1").hide();
              $("#intro2").show();
              $('#result1').hide();
              $('#result2').hide();
          }
      }
      else
      {
          // Train mode
          if ($('#start__btn_intro2').hasClass('stop_game')){
              //alert("Вы уверены, что хотите прервать игру?")
              cb.checked = true;
              Swal.fire({
                  title: 'Вы уверены, что хотите прервать игру?',
                  showDenyButton: false,
                  showCancelButton: true,
                  confirmButtonColor: 'rgb(137, 184, 10)',
                  confirmButtonText: 'Да, переключиться в режим Обучение',
                  cancelButtonText:'Отмена',
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                      // Остановить алгоритм
                      socket.send('Stop game. No plot.');
                      cb.checked = false;
                      $("#intro2").hide();
                      $("#intro1").show();
                      $('#result1').hide();
                      $('#result2').hide();
  
                      $('#start__btn_intro2').removeClass("stop_game");
                      $('#start__btn_intro2').val("Начать игру");
                      if ($('#start__btn_intro2').hasClass('nonactive')){
                        $('#start__btn_intro2').removeClass("nonactive");
                      }
                  }
                })
          }
          else{
              $("#intro2").hide();
              $("#intro1").show();
              $('#result1').hide();
              $('#result2').hide();
          }
      };
    });

    // Validation - clears message
    function clearInputMessageFor(input) {
        const cont = input.parentElement;
        var old_status = null;
        if (cont.classList.contains('success')){
            old_status = 'success';
        }
        else if (cont.classList.contains('error')){
            old_status = 'error';
        }
        if (old_status !=null){
            cont.classList.remove(old_status);
        }
    }

    // ValidationL - clears all messages in validation fields when the learning is complete
    function clear_validation(){
        var par1 = document.getElementById('par_epsilon_decay_linear');
        var par2 = document.getElementById('par_learning_rate');
        var par3 = document.getElementById('par_memory_size');
        var par4 = document.getElementById('par_batch_size');
        var par5 = document.getElementById('par_games_amount');
        var par_speed = document.getElementById('par_speed');

        clearInputMessageFor(par1);
        clearInputMessageFor(par2);
        clearInputMessageFor(par3);
        clearInputMessageFor(par4);
        clearInputMessageFor(par5);
        clearInputMessageFor(par_speed);
    }

    // ValidationG - clears all messages in validation fields when the game is complete
    function clear_validation_intro2(){
        var par1 = document.getElementById('par_epsilon_decay_linear_intro2');
        var par2 = document.getElementById('par_learning_rate_intro2');
        var par3 = document.getElementById('par_memory_size_intro2');
        var par4 = document.getElementById('par_batch_size_intro2');
        var par5 = document.getElementById('par_games_amount_intro2');
        var par_speed1 = document.getElementById('par_speed_intro2');

        clearInputMessageFor(par1);
        clearInputMessageFor(par2);
        clearInputMessageFor(par3);
        clearInputMessageFor(par4);
        clearInputMessageFor(par5);
        clearInputMessageFor(par_speed1);
    }
  })