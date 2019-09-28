import colorChange_mp3 from './sounds/colorChange.mp3'
import livesDecreased_mp3 from './sounds/livesDecreased.mp3'
import scoreAdded_mp3 from './sounds/scoreAdded.mp3'
import wrongSquare_mp3 from './sounds/wrongSquare.mp3'


var lives = 3;
var squares = []
var winColor
var correctSquare
var score = 0
const newSetOfSquaresElms = "<div class=\"row\"><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(0)\"></div></div><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(1)\"></div></div><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(2)\"></div></div><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(3)\"></div></div><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(4)\"></div></div><div class=\"col-4\"><div class=\"squares mx-auto\" onclick=\"PickMe(5)\"></div></div></div>"
var Audio_colorChange    = new Audio(colorChange_mp3);
var Audio_livesDecreased = new Audio(livesDecreased_mp3);
var Audio_scoreAdded     = new Audio(scoreAdded_mp3);
var Audio_wrongSquare    = new Audio(wrongSquare_mp3);

var scoreEl
var livesEl
var triesWrap
var endScreen
var gameButton
var livesContainer
var scoreCount
var livesCount
var colorDisplay
var tries

window.onload = () => {
   Audio_colorChange.load()
   Audio_livesDecreased.load()
   Audio_scoreAdded.load()
   Audio_wrongSquare.load()

   scoreEl = $('#score')
   livesEl = $('#lives')
   triesWrap = $('#triesWrap')
   endScreen = $('#endScreen')
   gameButton = $('#gameButton')
   livesContainer = $('.livesContainer')
   scoreCount = $('#scoreCount')
   livesCount = $('#livesCount')
   colorDisplay = $('#colorDisplay')
   tries = $('#tries')

   gameButton[0].addEventListener('click', StartPlay)

   scoreEl.hide()
   livesEl.hide()
   triesWrap.hide()
   endScreen.hide()
   SetSquaresDisabled(true)

   // Function definitions

   function StartPlay() {
      gameButton.css('pointerEvents', 'none')
      // Randomize squares colors
      RandomizeSquareColors()
      // Fade out play button
      gameButton.fadeOut(840, function() {
         // Hide play button
         gameButton.hide()
         scoreEl.fadeIn(() => scoreCount.text(score))
         livesEl.fadeIn(() => livesCount.text(lives))
         triesWrap.fadeIn()
         livesContainer.fadeIn()
      })
   }

   function InitSquareColors(i) {
      (i === 0) && SetSquaresDisabled(true)
      for (let s of squares) {
         s.style.backgroundColor = RandomRGB();
      }
      Audio_colorChange.pause()
      Audio_colorChange.currentTime = 0
      Audio_colorChange.play()
      // Init squares click listeners
      if(i === 6) {
         RefillTries()
         // Pick random win color from available squares color
         winColor = PickRandomWinColor()
         colorDisplay.text(winColor.toLocaleUpperCase())
         SetSquaresDisabled(false)
      } else {
         colorDisplay.text(PickRandomWinColor().toLocaleUpperCase())
      }
   }

   function RandomRGB() {
      let r = Math.floor(Math.random() * 256)
      let g = Math.floor(Math.random() * 256)
      let b = Math.floor(Math.random() * 256)

      return `RGB(${r} , ${g} , ${b})`
   }

   function PickRandomWinColor() {
      let chooseCorrect = Math.floor(Math.random() * 6)
      correctSquare = chooseCorrect
      return squares[chooseCorrect].style.backgroundColor
   }

   window.PickMe = function(picked) {
      // Disable all squares temporaly
      SetSquaresDisabled(true)
      // Check if picked color is correct
      if(squares[picked].style.backgroundColor === winColor) { // correct picked
         // Score add 1
         Audio_scoreAdded.play()
         scoreCount.text(score += tries.children().length)
         triesWrap.effect('bounce')
         scoreEl.effect('highlight', 100)
         setTimeout(function() {
            scoreEl.effect('highlight')
         }, 100)
         setTimeout(function() {
            $("#score").animate({
               backgroundColor: '#17a2b8'
            }, 100)
         }, 100)
         // Animate correct picked square
         $(squares[picked]).addClass('correctOne')
         $('.squares').animate({
            backgroundColor: winColor
         }, 1000, () => NextMove()) // Next move
      } else { // wrong picked
         Audio_wrongSquare.pause()
         Audio_wrongSquare.currentTime = 0
         Audio_wrongSquare.play()
         // Hide wrong square
         $(squares[picked]).addClass('hideSquare')
         // Remove one try if any length left
         if(tries.children().length) {
            $('#tries span:last-child').effect("drop", {direction: "down"}, () => {
               $('#tries span:last-child').remove()
               // Enable all squares again
               tries.children().length && SetSquaresDisabled(false)
               // No tries left
               if(tries.children().length === 0) {
                  // Lives -1
                  livesCount.text(--lives)
                  livesEl.effect( "shake")
                  FlashCorrect(correctSquare, () => {
                     // If lives === 0 then game over
                     if(lives === 0) {
                        $('#squaresContainer').fadeOut(() => {
                           $('#finalScore').text(score)
                           endScreen.fadeIn()
                        })
                     } else  {
                        NextMove()
                     }
                  })
                  // Play audio
                  Audio_livesDecreased.pause()
                  Audio_livesDecreased.currentTime = 0
                  Audio_livesDecreased.play()
               }
            })
         }
      }
   }

   function RandomizeSquareColors() {
      squares = $('.squares')
      for (let i = 0; i < 7; i++) {
         setTimeout(() => InitSquareColors(i), (i+1) * 120)
      }
   }

   function RefillTries() {
      while(tries.children().length != 3)  {
         tries.append("<span class=\"try bg-success rounded-circle mx-1\"></span>")      
      }
   }

   function NextMove() {
      // Remove any left squares
      $("#squaresContainer div.row").fadeOut(() => {
         $("#squaresContainer div.row").remove()
         // Place a new set of squares
         $("#squaresContainer").append(newSetOfSquaresElms).hide()
         SetSquaresDisabled(true)
         $("#squaresContainer").fadeIn(() => {
            RandomizeSquareColors()
         })     
      })
   }
   function SetSquaresDisabled(bool) {
      squares = $('.squares')
      for (const s of squares) {
         s.style.pointerEvents = bool ? 'none' : ''
      }
   }

   function FlashCorrect(n, callback) {
      $(squares[n]).addClass("position-absolute").css('z-index', 10).css('width', $(squares[n ? n-1 : n+1]).css('width'))
      $(squares[n]).effect("scale", {percent: 130, easing: "easeOutCubic"}, 1000, () => {
         $(squares[n]).effect("scale", {percent: 0, easing: "easeInCubic"}, () => callback())
      })
   }

}