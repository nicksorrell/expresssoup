'use strict';

$(function(){
  $.get('/cities', appendToList);

  function appendToList(cities){
    var list = [];
    var content, city;
    for(var i in cities) {
      city = cities[i];
      content = '<a href="#" data-city="' + city + '"><img src="img/del.png"></a>' + '<a href="/cities/' + city + '">' + city + '</a>';
      list.push($('<li>', { html: content }));
    }
    $('.city-list').append(list);
  }

  $('form').on('submit', function(event){
    event.preventDefault();
    var form = $(this);
    var cityData = form.serialize();

    $.ajax({
      type: 'POST', url: '/cities', data: cityData
    }).done(function(cityName){
      appendToList([cityName.toLowerCase()]);
      form.trigger('reset');
    });
  });

  $('.city-list').on('click', 'a[data-city]', function(e){
    e.preventDefault();
    if( !confirm('Are you sure you want to remove this city?') ){
        return false;
    }

    var target = $(e.currentTarget);

    $.ajax({
      type: 'DELETE', url: '/cities/' + target.data('city'), data: target.data('city')
    }).done(function(){
      target.parents('li').remove();
    });
  });
});
