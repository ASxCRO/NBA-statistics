jQuery(document).ready(function() {
	jQuery(".loader").delay(1000).fadeOut("slow");
  jQuery("#overlayer").delay(1000).fadeOut("slow");



  
});

let requestURL = 'https://data.nba.net/data/10s/prod/v1/2019/teams.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  const allClubs = request.response;
  const nbaClubs = allClubs['league']['standard'];
  listOnlyNBAfranchise(nbaClubs)
  NBAfranchise.forEach(element => {
    var teamDiv = document.createElement('div');
    teamDiv.setAttribute('class','team'); 
    if(element.confName == 'East')
    {
      teamDiv.className += ' ' + element.confName.toLowerCase();
    }
    else
    {
      teamDiv.className += ' ' + element.confName.toLowerCase();
    }
     teamDiv.setAttribute('id',element.tricode)
     var imgWrapper = document.createElement('div');
     imgWrapper.setAttribute('class', 'img-wrapper');
     var linkToModal = document.createElement('a')
     linkToModal.setAttribute('href','#');
     linkToModal.setAttribute('data-toggle','modal');
     linkToModal.setAttribute('data-target','profilKlubaModal');
     linkToModal.setAttribute('id',element.tricode);

     var clubImage = document.createElement('img');
     clubImage.setAttribute('src','https://www.nba.com/assets/logos/teams/primary/web/'+element.tricode+'.svg');
     teamDiv.append(imgWrapper);
     teamDiv.append(linkToModal);
     imgWrapper.append(linkToModal);
     linkToModal.append(clubImage);
     
    var textBellowImg = document.createElement('a');
    textBellowImg.setAttribute('href','#');
    textBellowImg.setAttribute('data-toggle','modal');
    textBellowImg.setAttribute('data-target','profilKlubaModal');
    textBellowImg.innerText = element.fullName;
    textBellowImg.setAttribute('id',element.tricode);

    teamDiv.append(textBellowImg);
    jQuery('.p-clubs-list').append(teamDiv);

  
  });
  FiltrirajIgraceKluba(2);

}

var NBAfranchise = [];
function listOnlyNBAfranchise(jsonObj) {

  for (let i = 0; i < jsonObj.length; i++) {
    if(jsonObj[i]['isNBAFranchise'] == true){
      NBAfranchise.push(jsonObj[i]);
    }
  }
}

NBAfranchise.forEach(element => {
  var teamDiv = document.createElement('div');
  teamDiv.setAttribute('class','team'); 
   teamDiv.setAttribute('id',element.teamId);
  jQuery('.p-clubs-list').append(teamDiv);

});

var team = 0;
var teamStandingsEast = [];
var teamStandingsWest = [];
var teamStandingsAll = [];
let requestURLstandings = 'https://data.nba.net/data/10s/prod/v1/current/standings_conference.json';
let requestStandings = new XMLHttpRequest();
requestStandings.open('GET', requestURLstandings);
requestStandings.responseType = 'json';
requestStandings.send();

requestStandings.onload = function() {
  var standingsAll = requestStandings.response;
  teamStandingsEast = standingsAll['league']['standard']['conference']['east'];
  teamStandingsWest = standingsAll['league']['standard']['conference']['west'];
  teamStandingsAll = teamStandingsAll.concat(teamStandingsEast,teamStandingsWest);
}

var games = [];
var playerId = 0;


let requestURLgames = 'https://data.nba.net/data/10s/prod/v1/2019/schedule.json';
let requestGames = new XMLHttpRequest();
requestGames.open('GET', requestURLgames);
requestGames.responseType = 'json';
requestGames.send();

requestGames.onload = function() {
  var gamesAll = requestGames.response;
  games = gamesAll['league']['standard'];

}


window.addEventListener("load", function(){
  $('.team a').click(function () {
      teamStandingsAll.forEach(element => {
        if($(this).attr('id') == element.teamSitesOnly.teamTricode)
        {
          team = element;
          $('#overall-score tbody').empty();
          $('#overall-score').css("margin-bottom","2rem");
          $('h4#profilKlubaLabel').text(team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname);

          var sRedak='<tr>';
          sRedak += '<td>'+ team.confRank +'</td>';
          sRedak += '<td>'+ team.win +'</td>';
          sRedak += '<td>'+ team.loss +'</td>';
          sRedak += '<td>'+ team.winPctV2 +'</td>';
          sRedak += '<td>'+ team.lossPctV2 +'</td>';
          sRedak += '<td>'+ team.homeWin +'</td>';
          sRedak += '<td>'+ team.homeLoss +'</td>';
          sRedak += '<td>'+ team.awayWin +'</td>';
          sRedak += '<td>'+ team.awayLoss +'</td>';
          sRedak += '</tr>';
        
          $('#overall-score tbody').append(sRedak);

        }
      });
      var Redak='<tr>';
      if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
        var table = $('#games-score').DataTable();
      }
      else {
        var table = $('#games-score').DataTable( {
          "responsive": true
        });
      }

      table.clear();
      FiltrirajUtakmice();
      FiltrirajIgraceKluba(1);

      
    
    $('#clubLogo').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+team.teamSitesOnly.teamTricode+'.svg');
    $('#clubLogo').attr('title', team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname);

    $('#profilKlubaModal').modal();
  });
  
  $(document).delegate('#prikaziProfilIgracaBtn', 'click', function()
  {
      playerId = $(this).attr('personid');
      // $('.modal-header').css('background','url(https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+playerId+'.png) no-repeat center right');
      players.forEach(player => {
        if(player.personId == playerId)
        {
          $('h4#profilIgracaLabel').text(player.firstName + ' ' + player.lastName);
          NBAfranchise.forEach(club => {
            if(club.teamId == player.teamId)
            {
              $('#clubLogo').attr('src','https://www.nba.com/assets/logos/teams/primary/web/'+club.tricode+'.svg');
              $('#clubLogo').attr('title', club.fullName);
              $('#playerImage').attr('src','https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+playerId+'.png');
              $('#playerImage').attr('title', player.firstName + ' ' + player.lastName);

            }
          
          });
        }
      });
      FiltrirajProfilIgraca(playerId);
      FiltrirajSezonuIgraca();
  });
});



function FiltrirajUtakmice()
{
  if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
    table = $('#games-score').DataTable();
  }
  else {
    table = $('#games-score').DataTable( {
      "responsive": true
    });
  }

  table.clear();
  var trazenaGodina = $('#dpdnGodina').val();
  if(trazenaGodina == undefined)
  {
    trazenaGodina = '2019';
  }

	let requestURLgame = 'https://data.nba.net/data/10s/prod/v1/'+trazenaGodina+'/schedule.json';
  let requestGame = new XMLHttpRequest();
  requestGame.open('GET', requestURLgame);
  requestGame.responseType = 'json';
  requestGame.send();


  requestGame.onload = function() {
    var gamesAll = requestGames.response;
    games = gamesAll['league']['standard'];

    var homeClub = '';
    var visitorClub = '';
    games.forEach(game => {
      if(game.hTeam.teamId == team.teamId || game.vTeam.teamId == team.teamId)
      {
        NBAfranchise.forEach(club => {
          if(club.teamId == game.hTeam.teamId)
          {
            homeClub = club.fullName;
          }
          else if(club.teamId == game.vTeam.teamId )
          {
            visitorClub = club.fullName;
          }
        });
        table.row.add( [ homeClub, visitorClub, game.hTeam.score, game.vTeam.score ] ).draw();
      }
    });
  }
  table.draw();
}


var players = [];
function FiltrirajIgraceKluba(broj)
{
  if ( $.fn.dataTable.isDataTable( '#club-players' )  ) {  
    var tablePlayers = $('#club-players').DataTable();
  }
  else {
    var tablePlayers = $('#club-players').DataTable( {
      "responsive": true
    });
  }
  if ( $.fn.dataTable.isDataTable( '#player-score' )  ) {  
    var tablePlayersScore = $('#player-score').DataTable();
  }
  else {
    var tablePlayersScore = $('#player-score').DataTable( {
      "responsive": true
    });
  }
 
  tablePlayers.clear();
  tablePlayersScore.clear();

	let requestURLplayers = 'https://data.nba.net/data/10s/prod/v1/2019/players.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();


  requestPlayers.onload = function() {
    var playersAll = requestPlayers.response;
    players = playersAll['league']['standard'];
    if(broj == 1)
    {
      players.forEach(player => {
    
        if(player.teamId == team.teamId )
        {
          tablePlayers.row.add( [ player.firstName, player.lastName, player.teamSitesOnly.posFull, player.yearsPro, player.country] ).draw();
        }
      });
    }
    else
    {
      players.forEach(player => {
        var button = '<div class="btn-group"><button type = "button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="edit"><span class="glyphicon glyphicon-option-vertical"></span></button><ul class="dropdown-menu"><li><a href="#" data-toggle="modal" data-target="#profilIgracaModal" id="prikaziProfilIgracaBtn" personid="'+player.personId+'">Player profile</a></li></ul></div>'
        tablePlayersScore.row.add( [button, player.firstName, player.lastName, player.teamSitesOnly.posFull, player.yearsPro, player.country] ).draw();
      });
    }
   

  }
}

var PlayerCarrer = 0;
var tablePlayerScore  = 0;

function FiltrirajProfilIgraca(playerIdpar)
{

  if ( $.fn.dataTable.isDataTable( '#player-score-carrer' )  ) {  
    tablePlayerScore = $('#player-score-carrer').DataTable();
  }
  else {
    tablePlayerScore = $('#player-score-carrer').DataTable( {
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching": false,
      "responsive": true
    });
  }
  tablePlayerScore.clear();

	let requestURLplayers = 'https://data.nba.net/data/10s/prod/v1/2019/players/'+playerIdpar+'_profile.json';
  let requestPlayers = new XMLHttpRequest();
  requestPlayers.open('GET', requestURLplayers);
  requestPlayers.responseType = 'json';
  requestPlayers.send();


  requestPlayers.onload = function() {
    let allPlayerInfo = requestPlayers.response;
    PlayerCarrer = allPlayerInfo['league']['standard']['stats']['careerSummary'];

    tablePlayerScore.row.add( [ PlayerCarrer.ppg, PlayerCarrer.rpg, PlayerCarrer.bpg, PlayerCarrer.mpg, PlayerCarrer.assists,PlayerCarrer.blocks,PlayerCarrer.steals,PlayerCarrer.turnovers,PlayerCarrer.gamesPlayed] ).draw();  
    
  }

 
}


var AllPlayerSeasons = 0;
var tablePlayerSeasonalScore = 0;

function FiltrirajSezonuIgraca() {
  if ( $.fn.dataTable.isDataTable( '#player-score-season' )  ) {  
    tablePlayerSeasonalScore = $('#player-score-season').DataTable();
  }
  else {
    tablePlayerSeasonalScore = $('#player-score-season').DataTable( {
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching": false,
      "responsive": true
    });
  }
  tablePlayerSeasonalScore.clear();

  var trazenaGodina = $('#dpdnGodina').val();
  if(trazenaGodina == undefined)
  {
    trazenaGodina = '2019';
  }

	let requestURLplayerSeason = 'https://data.nba.net/data/10s/prod/v1/'+trazenaGodina+'/players/'+playerId+'_profile.json';
  let requestPlayerSeason = new XMLHttpRequest();
  requestPlayerSeason.open('GET', requestURLplayerSeason);
  requestPlayerSeason.responseType = 'json';
  requestPlayerSeason.send();


  requestPlayerSeason.onload = function() {
    let allPlayerInfo = requestPlayerSeason.response;
    AllPlayerSeasons = allPlayerInfo['league']['standard']['stats']['regularSeason']['season'];

    AllPlayerSeasons.forEach(season => {
      if(season.seasonYear == trazenaGodina)
      {
        let demandedPlayerSeasonTotal = season.total;
        tablePlayerSeasonalScore.row.add( [ demandedPlayerSeasonTotal.ppg, demandedPlayerSeasonTotal.rpg, demandedPlayerSeasonTotal.bpg, demandedPlayerSeasonTotal.mpg, demandedPlayerSeasonTotal.assists,demandedPlayerSeasonTotal.blocks,demandedPlayerSeasonTotal.steals,demandedPlayerSeasonTotal.turnovers,demandedPlayerSeasonTotal.gamesPlayed] ).draw();  
      }
    });
  }
}







// var oKlubovi = sOdgovorPosluzitelja;
// var nRbr=1;
// for(var i=0; i<oVijesti.length; i++)
// {
//   var sRedak='<tr>';
//   sRedak += '<td>'+ nRbr++ +'</td>';
//   sRedak += '<td>'+ oVijesti[i].datum +'</td>';
//   sRedak += '<td>'+ oVijesti[i].post_naziv +'</td>';
//   sRedak += '<td><button type="button" onclick="window.location.href=\'\'" class="btn btn-primary"><span class="glyphicon glyphicon-link"></span></button></td>';
//   sRedak += '</tr>';

//   $('#clubs tbody').append(sRedak);
// }

    
        // if ( $.fn.dataTable.isDataTable( '#games-score' )  ) {  
        //   $('#games-score').DataTable();
        // }
        // else {
        //   $('#games-score').DataTable( {
        //     "paging":   true,
        //     "ordering": true,
        //     "info":     false,
        //     "searching": false
        //   });
        // }

//team.teamSitesOnly.teamKey+' '+team.teamSitesOnly.teamNickname