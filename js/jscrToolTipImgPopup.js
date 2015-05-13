//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @package Starweb Webshop System
 * @version See version-file
 * @copyright Copyright (c) 2000 - 2010, Ehandelslogik AB
 * 
 * @author Ehandelslogik AB, org.no 556696-9019  (Starweb)
 * Country: Sweden
 * Homepage: www.starweb.se
 * E-mail: support@starweb.se
 * 
 * License:
 * This program is not "free" software and restrictions apply!
 * This file as well as all other files containing the code to our software may ONLY be used and/or redistributed with written permission from us.
 * You'll find information regarding our conditions and pricing on our homepage. Contact us immediately if any of these conditions are not clear.
 */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** Initialize: Public variables */
/** @var string - Get: X (left) offset from mouse position */
var iCursorLeftOffsetNr = 15;  // 
/** @var string - Get: Y (top) offset from mouse position */
var iCursorTopOffsetNr  = 15;  // 
/** @var string - Get: On mouse over image/flash */
var sUrlSelImgOrFlash;
/** @var string - Get: On mouse over type (Img or Flash) */
var sUrlSelType;
/** @var int - Get: On mouse over image width (Img or Flash) */
var iImgSelOrgWdtNr;
/** @var int - Get: On mouse over image height (Img or Flash) */
var iImgSelOrgHgtNr;






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Image Popup Auto Zoom Hide
 * @access public
 */
function ImgPopupAutoZoomHide()
{
   // Stop: Follow mouse movement
   document.onmousemove = "";
   
   if(document.getElementById)
   {
      // Get: Settings
      var oImgPopupAutoZoom            = document.getElementById("cssImgPopupAutoZoom");
      oImgPopupAutoZoom.display        = "none";
      oImgPopupAutoZoom.innerHTML      = "";
      oImgPopupAutoZoom.style.position = "absolute";
      oImgPopupAutoZoom.style.zIndex   = "-99999";
   }
}






/**
 * Image Popup Auto Zoom Show
 * @access public
 * 
 * @param object oImg
 * @param string sType
 * @param string sUrlImg
 * @param int iOrgWdtNr
 * @param int iOrgHgtNr
 */
function ImgPopupAutoZoomShow(oImg, sType, sUrlImg, iOrgWdtNr, iOrgHgtNr)
{
   // Get: Settings
   sUrlSelType       = sType;
   sUrlSelImgOrFlash = sUrlImg.replace(" ", "%20");
   iImgSelOrgWdtNr   = iOrgWdtNr;
   iImgSelOrgHgtNr   = iOrgHgtNr;
   
   
   // Start: Follow mouse movement
   document.onmousemove = FollowMouseMovement;
}






/**
 * Follow Mouse Movement
 * @access public
 * 
 * @desc
 * iPageY                 = Which position the mousepointer is Y-led (top/bottom)
 * aWndSizeItem.height    = Total height available in browserwindow (depending on how big you've made your window)
 * aWndSizeItem.scrollTop = How far I've scrolled down my page
 * aPopupSizeItem.height  = Height of the popup-image
 *
 * @param event eFuncEvent
 */
function FollowMouseMovement(eFuncEvent)
{
   if(document.getElementById)
   {
      // Get: Settings
      var oImgPopupAutoZoom            = document.getElementById("cssImgPopupAutoZoom");
      oImgPopupAutoZoom.style.display  = "block";
      oImgPopupAutoZoom.style.position = "absolute";
      oImgPopupAutoZoom.style.zIndex   = "99999";
      var aWndSizeItem                 = GetWndSize();
      var aPopupSizeItem               = GetPopupSize(oImgPopupAutoZoom);
      var iPageX, iPageY, iPopupLeftNr, iPopupTopNr;
      
      
      // Get: X and Y where mousepointer is in both FF and IE!
      iPageX = parseInt(GetMouseCoordinateX(eFuncEvent));
      iPageY = parseInt(GetMouseCoordinateY(eFuncEvent));
      
      
      // Get: Left/top where popupwindow should be shown depending on how big the image is aswell as the size of the browserwindow
      if((aWndSizeItem.width + aWndSizeItem.scrollLeft) < (iPageX + aPopupSizeItem.width + iCursorLeftOffsetNr))
      { iPopupLeftNr = (iPageX - aPopupSizeItem.width - iCursorLeftOffsetNr); }
      else
      { iPopupLeftNr = (iPageX + iCursorLeftOffsetNr); }
      
      if((aWndSizeItem.height + aWndSizeItem.scrollTop) < (iPageY + (aPopupSizeItem.height / 2) + iCursorTopOffsetNr))
      { iPopupTopNr = (iPageY - aPopupSizeItem.height - iCursorTopOffsetNr); }
      else
      { iPopupTopNr = (iPageY + iCursorTopOffsetNr); }
      
      
      // Set: Left/top position on popupwindow
      oImgPopupAutoZoom.style.left = iPopupLeftNr + "px";
      oImgPopupAutoZoom.style.top  = iPopupTopNr + "px";
      
      
      // View: Image
      switch (sUrlSelType)
      {
         // Get: SWF flash movie html
         case "Flash":
            oImgPopupAutoZoom.innerHTML = GetSwfFlashMovieHtml(sUrlSelImgOrFlash, iImgSelOrgWdtNr, iImgSelOrgHgtNr);
            break;
            
            
         // Get: Image html
         default:
            oImgPopupAutoZoom.innerHTML = " <img src=" + sUrlSelImgOrFlash + " alt=\"\" />";
            break;
      }
   }
}






/**
 * Get Window Size
 * @access public
 */
function GetWndSize()
{
   return {
      scrollLeft: $(window).scrollLeft(),
      scrollTop:  $(window).scrollTop(),
      width:      $(window).width(),
      height:     $(window).height()
   };
}






/**
 * Get Popup Size
 * @access public
 */
function GetPopupSize(oImgPopupAutoZoom)
{
   return {
      width:  $("#cssImgPopupAutoZoom").width(),
      height: $("#cssImgPopupAutoZoom").height()
   };
}






/**
 * Get Mouse Coordinate X
 * @access public
 */
function GetMouseCoordinateX(evt)
{
   if(!evt) evt = window.event;
   
   
   if(evt.pageX)
      return evt.pageX;
      
   else if(evt.clientX)
      return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft);
      
   else
      return 0;
}







/**
 * Get Mouse Coordinate Y
 * @access public
 */
function GetMouseCoordinateY(evt)
{
   if(!evt) evt = window.event;
   
   
   if(evt.pageY)
      return evt.pageY;
      
   else if (evt.clientY)
      return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
      
   else
      return 0;
}
