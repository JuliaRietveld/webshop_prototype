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
/** @var object - Window name to open */
var oWnd = null;
/** @var string - Browser name */
var sBrowserName = GetBrowserName();
/** @var boolean - Is popup viewed before? */
var bIsViewedDivPopupMsg = false;



/**
 * Checks if string ends with substring.
 */
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CART FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Document Ready
 * @access public
 */
$(document).ready(function()
{
   // Set: Sortorder on order List
   $("#cssOrderList tr:even td").addClass("alt");
   $("#cssOrderList tr").hover(
      function(){
         $(this).css("cursor", "pointer").css("cursor", "hand");
         $(this).find("td").addClass("over");
      },
      function(){
         $(this).addClass("out");
         $(this).find("td").removeClass("over");
      }
   );

   $("#cssOrderList tr").click(function(){
      location.href = $(this).find("a").attr("href");
   });

   $(".cssSortOrderName").change(function(){
      location.href = $(".cssSortOrderName option:selected").val();
   });

   $(".cssSortOrderType").change(function(){
      location.href = $(".cssSortOrderType option:selected").val();
   });
});






/**
 * Autofocus Field
 * @access public
 *
 * Autofocus: On OrgNr_2 when OrgNr_1 is filled out
 *
 * @param string sFldNameThis
 * @param string sFldNameFocus
 */
function AutofocusFld(sFldNameThis, sFldNameFocus)
{
   $(sFldNameThis).keyup(function ()
   {
      if ($(this).val().length === $(this).attr("maxlength"))
      {$(sFldNameFocus).focus();}
   });
}






/**
 * Get Page By Url
 * @access public
 *
 * Is also used when saving customer information to session on keypress in checkout
 *
 * @param string sUrlAjax
 */
function GetPageByUrl(sUrlAjax)
{
   if (sUrlAjax != "")
   {
      $.ajax({
         type:    "GET",
         url:     sUrlAjax,
         timeout: 60000,
         success: function(sFrmResponse)
         {return false;}
      });
   }

   return false;
}






/**
 * Cart Show Or Hide Content
 * @access public
 *
 * @param string sLangShowCartContent
 * @param string sLangHideCartContent
 * @param boolean bIsCartOpenInSess
 * @param boolean bIsOnclick
 */
function CartShowOrHideContent(sLangShowCartContent, sLangHideCartContent, bIsCartOpenInSess, bIsOnclick)
{
   var bIsCartOpen;


   // Check: If url is clicked
   if (bIsOnclick == 1)
   {
      if ($(".cssCartData").is(":hidden"))
      {
         $(".cssUrlCartPreview").html(sLangHideCartContent);
         $(".cssCartData").show();
         bIsCartOpen = 1;
      }
      else
      {
         $(".cssCartData").hide();
         $(".cssUrlCartPreview").html(sLangShowCartContent);
         bIsCartOpen = 0;
      }


      // Set: If cart is open/closed to session
      var  sUrlExt = "pgAjaxLoad.php?sFunc=bIsCartOpen&bIsCartOpen=" + bIsCartOpen;
      GetPageByUrl(sBaseUrl + "/Shop/Page/" + sUrlExt);
   }
   else
   {
      if (bIsCartOpenInSess == 1)
      {
         $(".cssUrlCartPreview").html(sLangHideCartContent);
         $(".cssCartData").show();
      }
      else
      {
         $(".cssCartData").hide();
         $(".cssUrlCartPreview").html(sLangShowCartContent);
      }
   }
}






/**
 * Animate an object being added to cart.
 *
 * @param {Object} oCurrentObj
 * @param {function} fnCallbackWhenDone
 */
function animateAddItemToCart(oCurrentObj, fnCallbackWhenDone)
{
   // Close: Fancybox window (if it's open)
   CloseFancybox();

   // Scroll: To top of page
   if (bIsScrollToCart)
   {  $("html, body").animate({ scrollTop: 0}, 500); }


   // View: Animate cart with dash-box-movement (jQuery UI Transfer Effect)...
   if (bIsAnimateCart && $('.cssCartBoxInner').length && $('.cssCartBoxInner').is(':visible'))
   {
      $(oCurrentObj).effect('transfer', {to: '.cssCartBoxInner'}, 500, function() {
         if (fnCallbackWhenDone)
         {fnCallbackWhenDone();}
      });
   }
   else
   {
      if (fnCallbackWhenDone)
      {fnCallbackWhenDone();}
   }
}






/**
 * Animate cart shaking.
 */
function animateCartShake()
{
   // Set: Shake cart when placing an article in it (jQuery UI Shake Effect)
   if(bIsAnimateCart)
   {$(".cssCartBox").effect("shake", {times: 1, direction: "up", distance: 5}, 100);}
}






/**
 * Add an item to cart.
 */
function addItemToCart(iArt_Id, sArtModelId, iArtQtyNr, aArtCustomVals, fnCallbackWhenDone)
{
   if (iArt_Id && sArtModelId)
   {
      iArt_Id = parseInt(iArt_Id, 10);
      iArtQtyNr = iArtQtyNr ? parseInt(iArtQtyNr, 10) : 1;
      var itemData = {'iArt_Id': iArt_Id, 'sArtModelId': sArtModelId, 'iArtQtyNr': iArtQtyNr};
      if (aArtCustomVals)
      {itemData.aArtCustomVals = aArtCustomVals;}

      // Call: Ajax function to add product to cart
      $.ajax({
         type: 'GET',
         url: getShopUrl('/cart/add-item'),
         timeout: 10000, // 10s
         cache: false,
         data: itemData,
         dataType: 'json',
         success: function(oData) {
            if (oData)
            {
               // Update: Cart HTML if cart exists
               if ($('.cssCartBox').length)
               {updateCartHtml(oData);}

               if (fnCallbackWhenDone)
               {fnCallbackWhenDone();}

               // Reload: Page if we are already in checkout (otherwise page will only display that cart is empty)
               if (window.location.pathname.endsWith('/checkout'))
               {  location.reload();}
            }
         }
      });
   }
}


function updateCartHtml(oData)
{
   // Set: Class indicating if cart has goods or not
   if (oData.aaItems.length)
   {$(".cssCartBox").addClass("cssCartBoxHasGoods");}
   else
   {$(".cssCartBox").removeClass("cssCartBoxHasGoods");}


   // Update: Cart contents
   $(".cssCartCost").text(oData.sPriceSumFormatted);
   $(".cssCartArtTotalQtyNr").text((oData.iItemCountNr > 0) ? oData.iItemCountNr : '');
   $(".cssCartArtTxtNr").text(oData.sItemCountText);
   $("#cssCartContentsCon").html($('#cartDataTpl').mustache(oData));
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CART FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* JQUERY DIALOG - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Submit Page
 * @access public
 *
 * Submits the page, and validates the fields
 *
 * @param string sUrlPage
 * @param string sFrmName
 * @param string sAction
 * @param boolean bIsReloadCart (not used anymore)
 * @param string sDivName
 * @param string sFldName
 * @param string sDialogTitle
 * @param string sLocationHref
 */
function SubmitPage(sUrlPage, sFrmName, sAction, bIsReloadCart, sDivName, sFldName, sDialogTitle, sLocationHref)
{
   // Get: Settings
   var sUrlExt      = (sUrlPage.indexOf("?") != -1) ? "&" : "?";
   var sUrlAjax     = sUrlPage + sUrlExt + "sAction=" + sAction;
   var aFrmDataItem = $("#" + sFrmName).serialize();
   sDivName         = ((sDivName != "") && (sDivName != false) && (sDivName != undefined)) ? sDivName : "cssPageContainer";


   $.ajax({
      type: "POST",
      url: sUrlAjax,
      data: aFrmDataItem,
      timeout: 60000,
      success: function(sFrmResponse)
      {
         // Get: Form result
         var sFrmResult = jQuery.trim(sFrmResponse);


         // Validate: Page
         if (sAction == "bIsValidate")
         {ValidatePage(sFrmResult, sDialogTitle);}

         // Reload: Page due to page is submitted
         else
         {
            // View: Message
            if (sFldName)
            {$(sFldName).val(sFrmResult);}
            else
            {
               // VALID RESULT - CustLogin/CustLoginEdit = REDIRECT: View welcome customer page. Login through "Customer information"
               // See SubmitPageCustLogin() below.
               if ((sFrmResult.indexOf("cssWarnMsg") == -1) && (sLocationHref != "") && (sLocationHref != undefined))
               {
                  // Close: Fancybox window (if it's open)
                  CloseFancybox();
                  location.href = sLocationHref;
               }


               $("." + sDivName).html(sFrmResult);
            }

         }
      }
   });


   return false;
}






/**
 * Validate Page
 * @access public
 *
 * @param string sWarnResult
 * @param string sDialogTitle
 */
function ValidatePage(sWarnResult, sDialogTitle)
{
   // Found error, return true
   if (sWarnResult == "")
   {
      return true;
   }
   else
   {
      // Get: Settings
      var sWarnMsg   = "";
      var aErrorItem = sWarnResult.split("@@");
      sDialogTitle.replace("'", "");


      for (var iNr=1; iNr<aErrorItem.length; iNr++)
      {if (aErrorItem[iNr] != ""){sWarnMsg += aErrorItem[iNr];}}


      if (sWarnMsg != "")
      {
         $("#cssErrorDialogMsg").html("<ul>" + sWarnMsg + "</ul>");

         // Show: Dialog using jQuery UI Dialog widget
         var doOk       = function(){$(this).dialog("destroy");}
         var dialogOpts = {
            title: sDialogTitle,
            dialogClass: "cssDialogMsg",
            position: "top",
            autoOpen: true,
            modal: true,
            width: 400,
            overlay:
            {
               opacity: 1,
               background: "#000000"
            },
            buttons:
            {"Ok": doOk}
         }

         // Show: Dialog using jQuery UI Dialog widget
         $("#cssErrorDialogMsg").dialog(dialogOpts);
      }
   }


   return false;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* JQUERY DIALOG - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CUSTOMER FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Submit Page Customer Login
 * @access public
 *
 * @param string sFrmName
 * @param string sFrmSel
 * @param string sPageName
 * @param string sDivName
 * @param string sCustLoginAction
 * @param string sLocationHref
 *
 * @return boolean
 */
function SubmitPageCustLogin(sFrmName, sFrmSel, sPageName, sDivName, sCustLoginAction, sLocationHref)
{
   $(document).ready(function()
   {
      $("#"+ sFrmName, this).submit(function()
      {
         // Get: Settings
         var sUrlAjax     = sBaseUrl +"/Shop/Page/"+ sPageName +"sCustLoginAction="+ sCustLoginAction;
         var aFrmDataItem = $("#"+ sFrmName).serialize();


         $.ajax({
            type: "POST",
            url: sUrlAjax,
            data: aFrmDataItem,
            timeout: 60000,
            success: function(sFrmResponse)
            {
               // Get: Form result
               var sFrmResult = jQuery.trim(sFrmResponse);


               switch (true)
               {
                  // VALID RESULT - CustLostPwd = View OK message
                  case ((sFrmResult.indexOf("cssWarnMsg") == -1) && (sFrmSel == "frmCustLostPwd")):
                     $("#"+ sDivName).html(sFrmResult);
                     $("#frmCustLostPwd #sEmailAddress").val("");
                     break;


                  // VALID RESULT - CustLogin/CustLoginEdit = REDIRECT: View welcome customer page. Login through "Customer information"
                  // NEW customers in SHOP are redirected through SubmitPage() function in jscrPage
                  case ((sFrmResult.indexOf("cssWarnMsg") == -1) && ((sFrmSel == "frmCustLogin") || (sFrmSel == "frmCustLoginEdit")) && (sLocationHref != "")):
                     // Close: Fancybox window (if it's open)
                     CloseFancybox();
                     location.href = sLocationHref;
                     break;


                  // VALID RESULT - Close window, and reload checkout cart page. Login through "Checkout"
                  case (sFrmResult.indexOf("cssWarnMsg") == -1):
                     // Close: Fancybox window (if it's open)
                     CloseFancybox();
                     CheckOutReloadAjax("", "bIsCustLogin");
                     break;


                  // INVALID RESULT - View error message
                  default:
                     $("#"+ sDivName).html(sFrmResult);
                     break;
               }
            }
         });

         return false;
      });
   });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CUSTOMER FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* FANCYBOX FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Close Fancybox
 * @access public
 */
function CloseFancybox()
{
   //var sFancyBoxWnd = $("#fancy_overlay").css("display");
   var sFancyBoxWnd = $("#fancybox-overlay").css("display");
   // Close: Fancybox window (if it's open)
   if ((sFancyBoxWnd != "none") && (sFancyBoxWnd != undefined))
   //{ if ($.fn){  $.fn.fancybox.close(); } }
   {$.fancybox.close();}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* FANCYBOX FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* BROWSER FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Get Browser Name
 * @access public
 *
 * Original script was found at:
 * http://parentnode.org/javascript/javascript-browser-detection-revisited/
 *
 * [if gte IE 7]
 * none => no value means only for the specified version: [if IE 7] will only work for IE 7
 * “lte” means “lower than or equal to”
 * “lt” means “lower than”
 * “gte” means “greater than or equal to”
 * “gt” means “greater than”
 * To target all IE versions, simply use <!–[if IE]>
 */
function GetBrowserName()
{
   var BO        = new Array();
   var bIsSafari = (document.childNodes) && (!document.all) && (!navigator.taintEnabled) && (!navigator.accentColorName);


   BO["Ie"]        = false /*@cc_on || true @*/;
   BO["Ie4"]       = BO["Ie"] && (document.getElementById == null);
   BO["Ie5"]       = BO["Ie"] && (document.namespaces == null) && (!BO["Ie4"]);
   BO["Ie6"]       = BO["Ie"] && (document.implementation != null) && (document.implementation.hasFeature != null) && (window.XMLHttpRequest == null);
   BO["Ie7"]       = BO["Ie"] && (document.implementation != null) && (document.compatMode != null) && (window.XMLHttpRequest != null);
   BO["Ie55"]      = BO["Ie"] && (document.namespaces != null) && (!BO["Ie6"]) && (!BO["Ie7"]);

   BO["Ns4"]       = !BO["Ie"] &&  (document.layers != null) &&  (window.confirm != null) && (document.createElement == null);
   BO["Opera"]     = (self.opera != null);
   BO["Gecko"]     = (document.getBoxObjectFor != null); // Firefox
   BO["Khtml"]     = (navigator.vendor == "KDE");
   BO["Konq"]      = ((navigator.vendor == 'KDE') || (document.childNodes) && (!document.all) && (!navigator.taintEnabled));

   BO["Safari1.2"] = (parseInt(0).toFixed == null) && (bIsSafari && (window.XMLHttpRequest != null));
   BO["Safari2.0"] = (parseInt(0).toFixed != null) && bIsSafari && !BO["Safari1.2"];
   BO["Safari1.1"] = bIsSafari && !BO["Safari1.2"] && !BO["Safari2.0"];


   sBrowserName = false;
   for (sKey in BO)
   {
      if (BO[sKey] == true)
      {
         // Get: Browser name
         sBrowserName = sKey;

         // Break the loop
         break;
      }
   }


   return (sBrowserName != false) ? sBrowserName : (navigator.appName + navigator.appVersion); //parseInt(navigator.appVersion)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* BROWSER FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TOGGLE FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






/**
 * Div Toggle
 * @access public
 *
 * @param string sDivName
 * @param int iState
 */
function DivToggle(sDivName, iState)
{
   // NN4+
   if (document.layers)
   {
      var oNN4Div = document.layers[sDivName];

      if (oNN4Div)
      {oNN4Div.visibility = iState ? "show" : "hide";}
   }

   // Gecko(NN6) + IE 5+
   else if (document.getElementById)
   {
      var oNN6Div = document.getElementById(sDivName);

      if (oNN6Div)
      {oNN6Div.style.visibility = iState ? "visible" : "hidden";}
   }

   // IE 4
   else if (document.all)
   {
      var oIE4Div = document.all[sDivName];

      if (oIE4Div)
      {oIE4Div.style.visibility = iState ? "visible" : "hidden";}
   }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TOGGLE FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* WINDOW FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Open Popup Window
 * @access public
 *
 * @param string sUrl
 * @param int iWdtNr
 * @param int iHgtNr
 * @param boolean bIsResizable
 */
function OpenPopupWnd(sUrl, iWdtNr, iHgtNr, bIsResizable)
{
   // Get: Settings
   var iLeftNr   = ((screen.width / 2) - (iWdtNr / 2));
   var iTopNr    = ((screen.height / (2 - iHgtNr)) / (2 - (iHgtNr / 10)));
   var sFeatures = 'toolbar=no, location=no, directories=no, status=yes, menubar=no, scrollbars='
      + bIsResizable + ', resizable=' + bIsResizable + ', width=' + iWdtNr + ', height=' + iHgtNr
      + ',alwaysRaised=yes, left=' + iLeftNr + ', top=' + iTopNr + ',screenX=0, screenY=0';


   // Close opened window
   if (oWnd && !oWnd.closed)
   {oWnd.close();}


   oWnd = window.open(sUrl, "OpenPopupWnd", sFeatures);
   oWnd.location.href = sUrl;
   if (!oWnd.opener){oWnd.opener = self;}
   oWnd.focus();
}






/**
 * Center Window
 * @access public
 */
function CenterWnd()
{
   // Get: Settings
   var iScreenWdtNr = screen.availWidth;
   var iScreenHgtNr = screen.availHeight;


   // Set: Move window to middle of screen
   window.moveTo(((iScreenWdtNr-document.body.clientWidth) / 2), ((iScreenHgtNr-document.body.clientHeight) / 2));
}






/**
 * View Div Popup Message
 * @access public
 *
 * @param string sDivName
 * @param string iFadeSecNr
 * @param boolean bIsSetCss
 * @param string iLeftNr
 * @param string iTopNr
 */
function ViewDivPopupMsg(sDivName, iFadeSecNr, bIsSetCss, iLeftNr, iTopNr)
{
   $(document).ready(function()
   {
      if (bIsViewedDivPopupMsg == false)
      {
         // Get: Scroll cordinates
         iFadeSecNr  = iFadeSecNr ? iFadeSecNr : 1300;


         // Set: Placement of popup
         if (bIsSetCss == true)
         {
            iLeftNr     = iLeftNr ? iLeftNr : (screen.width / 3);
            iTopNr      = iTopNr ? iTopNr : ((screen.height / 3) + GetScrollXY("Y"));

            $(sDivName).css({"top": iTopNr+"px", "left": iLeftNr+"px"});
         }


         // Set: Fade popup
         $(sDivName).fadeIn("normal").fadeTo(iFadeSecNr, 1).fadeOut("normal");


         // Set: Cart popup is only viewed once
         if (sDivName == "#cssCartBuyPopupMsg")
         {bIsViewedDivPopupMsg = true;}
      }
   });
}






/**
 * View Newsletter Message
 * @access public
 *
 * @param string sUrlPage
 * @param string sFrmName
 * @param string sAction
 * @param boolean bIsReloadCart
 * @param string sDivName
 * @param string sCssName
 */
function ViewNewsletterMsg(sUrlPage, sFrmName, sAction, bIsReloadCart, sDivName, sFldName, sCssName)
{
   $(document).ready(function()
   {
      if (TrimStr($(sFldName).val()) != "")
      {
         $("#" + sCssName).fadeOut("normal");
         SubmitPage(sUrlPage, sFrmName, sAction, bIsReloadCart, sDivName, sFldName);
         $("#" + sCssName).fadeIn("normal");
      }
   });
}






/**
 * Get Scroll X/Y
 * @access public
 *
 * Get scroll cordinates. Is used by SettEdit etc.
 *      Script was found at: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
 *
 * @param string sXorY
 */
function GetScrollXY(sXorY)
{
  var scrOfX = 0, scrOfY = 0;

  if ( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if ( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }


  return (sXorY == "X") ? scrOfX : scrOfY;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* WINDOW FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* STRING FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Trim String
 * @access public
 *
 * @param string sVal
 *
 * @return string
 */
function TrimStr(sVal)
{
   if (sVal != '')
   {
      while(sVal.substring(0, 1) == ' ')
      {sVal = sVal.substring(1, sVal.length);}

      while(sVal.substring(sVal.length - 1, sVal.length) == ' ')
      {sVal = sVal.substring(0, sVal.length - 1);}
   }


   return sVal;
}






/**
 * Get Random String
 * @access public
 */
function GetRandStr()
{
   // Get: Settings
   var iLenNr   = 30;
   var sChrList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   var sStrRnd  = "";

   for (var iNr=0; iNr<iLenNr; iNr++)
   {
      var iRandPosNr  = Math.floor(Math.random() * sChrList.length);
      sStrRnd        += sChrList.substring(iRandPosNr, iRandPosNr+1);
   }

   return sStrRnd;
}






/**
* Clear Field
* @access public
*
* @param string sTxtBoxName
*/
function ClearFld(sTxtBoxName)
{
   oTxtBox       = document.getElementById(sTxtBoxName);
   oTxtBox.value = "";
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* STRING FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* COST FUNCTIONS - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Is Integer
 * @access public
 *
 * @param int iInt
 *
 * @return boolean
 */
function IsInteger(iInt)
{
   return (("" + parseInt(iInt)) == iInt);
}






/**
 * Get Round Cost Number
 * @access public
 *
 * @param float fCostNr
 *
 * @return int
 */
function GetRoundCostNr(fCostNr)
{
   if (fCostNr == '')
   {return '-';}
   else
   {
      fCostNr = fCostNr - 0; // Force number
      iCurrDecNr = iCurrDecNr - 0; // Force number
      var fFloatVar = Math.pow(10, iCurrDecNr);

      //fCostNr += Math.pow(10, - (iCurrDecNr + 1));
      fCostNr = Math.round(fCostNr * fFloatVar) / fFloatVar;

      fCostNr += Math.pow(10, - (iCurrDecNr + 1));
      fCostNr += ""; // Force string
      fCostNrFormatted = (iCurrDecNr == 0)
         ? fCostNr.substring(0, fCostNr.indexOf('.'))
         : fCostNr.substring(0, fCostNr.indexOf('.') + (iCurrDecNr + 10));


      return GetFormattedNr(fCostNrFormatted, iCurrDecNr, ",", " ");
   }
}






/**
 * Get Formatted Number
 * @access private
 *
 * Made by Mathias Bynens <http://mathiasbynens.be/>
 *
 * @param float a
 * @param int b
 * @param string c
 * @param string d
 *
 * @return int
 */
function GetFormattedNr(a, b, c, d)
{
   a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
   e = a + '';
   f = e.split('.');

   if (!f[0])
   {f[0] = '0';}

   if (!f[1])
   {f[1] = "";}

   if (f[1].length < b)
   {
      g = f[1];

      for (i=f[1].length+1; i<=b; i++)
      {g += '0';}

      f[1] = g;
   }

   if (d != '' && f[0].length > 3)
   {
      h = f[0];
      f[0] = "";
      for (j = 3; j < h.length; j+=3)
      {
         i = h.slice(h.length - j, h.length - j + 3);
         f[0] = d + i +   f[0] + '';
      }

      j = h.substr(0, (h.length % 3 == 0) ? 3 : (h.length % 3));
      f[0] = j + f[0];
   }

   c = (b <= 0) ? '' : c;


   return f[0] + c + f[1];
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* COST FUNCTIONS - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






/**
 * Execute Article Search
 * @access public
 *
 * Redirect value in search textbox to url -> article search list page
 */
function ExecArtSearch()
{
   // Get: Article search texbox
   var oArtSearch = document.getElementById("sArtSearch");


   // Get: Url location in Main-frame to search for entered string value
   if (TrimStr(oArtSearch.value) != '')
   {
      // Get: Setting
      var sUrlRedirect = sBaseUrl + '/Shop/Page/Art/pgArtList.php?sSearchWord=' + escape(oArtSearch.value);


      // Redirect: To valid page
      location.href = sUrlRedirect;
   }


   // Set: Focus on texbox again
   oArtSearch.focus();


   return false;
}






/**
 * Article Search Suggestions
 * @access public
 *
 * View AJAX article suggestion list in search textbox using jQuery UI Autocomplete widget
 */
$(document).ready(function()
{
   var oAutoComplete;


   // Set: Autocomplete (element different in Shop/Admin)
   if ($("#sArtSearch").length)
   {
      oAutoComplete = $("#sArtSearch").autocomplete({
         source    : sBaseUrl + "/Shop/Page/pgAjaxLoad.php?sFunc=bArtSearchSuggestions",
         minLength : 1,
         select    : function (event, ui) {
            // Force: Fill the searchbox with selected value
            $("#sArtSearch").val(ui.item.value);
            // Call: Search form script function when selecting a suggestion
            ExecArtSearch();
         }
      })
   }
   else if ($("#aSearchItem\\[sSearchWord\\]").length)
   {
      // Set: Autocomplete disabled if something other than article search is chosen
      $("#aSearchItem\\[sSearchTbl\\]").change(function()
      {
         if ($("#aSearchItem\\[sSearchTbl\\]").val() != "Art")
         {$("#aSearchItem\\[sSearchWord\\]").autocomplete("option", "disabled", true);}
         else
         {$("#aSearchItem\\[sSearchWord\\]").autocomplete("option", "disabled", false);}
      });

      oAutoComplete = $("#aSearchItem\\[sSearchWord\\]").autocomplete({
         source    : sBaseUrl + "/Admin/Page/Ajax/pgAjax.php?sType=bArtSearchSuggestions",
         minLength : 1,
         select    : function (event, ui) {
            // Force: Fill the searchbox with selected value
            $("#aSearchItem\\[sSearchWord\\]").val(ui.item.value);
            // Call: Search form script function when selecting a suggestion
            ExecSearch();
         }
      });
   }

   // Set: Highlight search suggestions characters matching search term
   if (oAutoComplete != null)
   {
      oAutoComplete.autocomplete._renderItem = function( ul, item ) {

         var iHighlightChars = 0;
         for (var i = 0; i < this.term.length; i++)
         {
            // Check: If characters at corresponding positions match, break otherwise
            if (this.term.toLowerCase().charAt(i) == item.label.toLowerCase().charAt(i))
            {iHighlightChars++;}
            else
            {break;}
         }

         // Set: Surround highlighted characters with strong-tags
         if (iHighlightChars > 0)
         {item.label = "<strong>" + item.label.substr(0, iHighlightChars) + "</strong>" + item.label.substr(iHighlightChars);}

         //item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "i"), "<strong>$1</strong>");
         return $("<li></li>")
                 .data("item.autocomplete", item)
                 .append("<a>" + item.label + "</a>")
                 .appendTo(ul);
      };
   }
});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CUSTOMER EDIT FUNCTION - START */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('document').ready(function(){
   // Tab menu functionality
   $('.cssCustWelcome .cssTabMenu li a').click(function(eEvent){
      eEvent.preventDefault();

      var sTargetId = '#'+ $(this).attr('rel');

      $('.cssCustWelcome .cssTabMenu li.cssTabActive').removeClass('cssTabActive');
      $(this).parents('li').addClass('cssTabActive');

      $('.cssTabMenuContent div.cssTabMenuContainer').each(function(){
         if ($(this).hasClass('cssVisible'))
         {$(this).removeClass('cssVisible').addClass('hide');}
      });

      $(sTargetId).removeClass('hide').addClass('cssVisible');
   });


   // Place previous order in cart
   $('#cssOrderItemBuyBtn').click(function(oEvent)
   {
      oEvent.preventDefault();

      animateAddItemToCart(this, function() {
         $.ajax({
            type: 'GET',
            url: getShopUrl('/cart/add-order-content'),
            data: {'iOrder_Id': $('#iOrder_Id').val()},
            timeout: 5000, // 5s
            cache: false,
            dataType: 'json',
            success: function(aResponse) {
               // Update: Cart HTML if cart exists
               if (aResponse && $('.cssCartBox').length)
               {
                  updateCartHtml(aResponse);
                  animateCartShake();
               }
            }
         });
      });
   });
});






/**
 * strip slashes from string
 *
 * @param string str
 *
 * @return string str
 */
function stripslashes(str) {
   str=str.replace(/\\'/g,'\'');
   str=str.replace(/\\"/g,'"');
   str=str.replace(/\\0/g,'\0');
   str=str.replace(/\\\\/g,'\\');


   return str;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* CUSTOMER EDIT FUNCTION - END */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






/**
 * Get a relative based (starts with /) URL to a new router resource.
 *
 * @param {string} sRelativeRewrittenPath
 * @return string
 */
function getShopUrl(sRelativeRewrittenPath)
{
   // Return: URL without any rewrite (rewrite fallback) if url is tilde (~) based
   if (sBaseUrl.indexOf('~') != -1)
   {
      var sIndexPath = (sRelativeRewrittenPath.indexOf('/admin') == 0) ? sBaseUrl + '/Admin/public/index.php' : sBaseUrl + '/public/index.php';
      return sIndexPath + '?sRouterReqUrl=' + escape(sRelativeRewrittenPath);
   }
   // Return: Standard rewritten URL
   else
   {return sBaseUrl+sRelativeRewrittenPath;}

}






/**
 * Get html formatted error message.
 *
 * @param {Array} aErrorMsgs
 * @return {string}
 */
function getHtmlErrorMsgs(aErrorMsgs)
{
   var sHtml = '';

   if (aErrorMsgs !== undefined && aErrorMsgs.length > 0)
   {
      sHtml += '<ul class="cssWarnMsg">';

      for(var i = 0; i < aErrorMsgs.length; i++)
      {sHtml += '<li>'+aErrorMsgs[i]+'</li>';}

      sHtml += '</ul>';
   }


   return sHtml;
}






/**
 * jQuery UI dialog alert message.
 *
 * @param {mixed} mAlertMsg The alert html or array of list elements which html should be created from
 */
function dialogAlert(mAlertMsg)
{
   var sErrorHtml = mAlertMsg;
   if ($.isArray(mAlertMsg))
   {
      sErrorHtml = '<ul>';
      $.each(mAlertMsg, function(iIndexNr, sText) {
        sErrorHtml += '<li>' + sText + '</li>';
      });
      sErrorHtml += '</ul>';
   }

   $('<div id="cssDialogAlert"></div>').html(sErrorHtml).appendTo('body');

   $('#cssDialogAlert').dialog({
      dialogClass: 'cssDialogAlert',
      position: {
         my: 'center',
         at: 'center',
         offset: '0 -200'
      },
      autoOpen: true,
      modal: true,
      resizable: false,
      width: 400,
      overlay: {opacity: 1, background: "#000000"},
      buttons: {'Ok': function() {
         $(this).dialog('close');
      }},
      close: function() {
         $(this).dialog('destroy').remove();
      }
   });
}






/**
 * Object to start a text loading indicator animation (for ex, from dots).
 *
 * Meant to be used on a element containg at least one text character (eg. a ".")
 * which is then repeated.
 *
 * @param {string} sSelectorStr
 * @param {int} iMaxCountNr
 * @param {int} iDelayNr
 */
function TextLoadingIndicator(sSelectorStr, iMaxCountNr, iDelayNr)
{
   // Get: Element
   var oText = $(sSelectorStr);
   if (!oText.length)
   {return;}

   // Get: First characater and use as the repeating
   var sFirstChar = oText.text().charAt(0);

   // Check: That a first character exist
   if (sFirstChar)
   {
      // Set: An interval to repeat all this each iDelayNr milliseconds
      var iCurrentCharNr = 0;
      var iIntervalIdNr = window.setInterval(function() {
         // Check: That element is still there
         if (!$(sSelectorStr).length)
         {
            window.clearInterval(iIntervalIdNr);
            return;
         }

         // Set: Chars to be displayed to for eg. 0, 1, 2, 0, 1, 2, 0 etc..
         var iCharsToDisplayNr = (iCurrentCharNr % (iMaxCountNr + 1));

         // Set: Output string to repeat the first char x times
         var sOutput = '';
         for (var i=0; i < iCharsToDisplayNr; i++)
         {sOutput += sFirstChar;}

         oText.text(sOutput);
         iCurrentCharNr++;

      }, iDelayNr);
   }

   // Set: Method to stop the loader interval
   this.stop = function () {
      window.clearInterval(iIntervalIdNr);
   };
}






/**
 * jQuery ready().
 */
$(function() {

   /**
    * Closed product category click.
    */
   $(document).on('click', '.cssProdCatTreeClosedNode > .cssProdCatTreeNodeIcon, .cssProdCatTreeClosedNode > .cssProdCatTreeLink', function(oEvent) {

      // Return: If it's a link click and category shouldn't only expand (forward user to link page instead)
      if ($(this).is('a') && !$(this).hasClass('cssProdCatExpandOnlyLink'))
      {  return true; }

      oEvent.preventDefault();

      // Open: This category (get sub node data from db)
      $.ajax({
         type: 'GET',
         url: getShopUrl('/category/open'),
         timeout: 5000, // 5s
         cache: false,
         data: {'iId': $(this).parent().data('id')},
         dataType: 'json',
         success: function(aResponse) {
            if (aResponse)
            {
               var sTplPartial = $('#prodCatSubTreeTpl').html();
               var sTplHtml = $('#prodCatTreeTpl').mustache(aResponse, {'prodCatSubTree': sTplPartial});
               $('#cssProdCatTreeCon').html(sTplHtml);
            }
         }
      });
   });



   /**
    * Open product category click.
    */
   $(document).on('click', '.cssProdCatTreeOpenNode > .cssProdCatTreeNodeIcon, .cssProdCatTreeOpenNode > .cssProdCatTreeLink', function(oEvent) {

      // Return: If it's a link click and category shouldn't only expand (forward user to link page instead)
      if ($(this).is('a') && !$(this).hasClass('cssProdCatExpandOnlyLink'))
      {  return true; }

      oEvent.preventDefault();

      // Close: This category
      $(this).siblings('.cssProdCatTreeSubTree').remove();
      $(this).parent('.cssProdCatTreeOpenNode').removeClass('cssProdCatTreeOpenNode').addClass('cssProdCatTreeClosedNode');
      $(this).parent().children('.cssProdCatTreeNodeIconOpen').removeClass('cssProdCatTreeNodeIconOpen').addClass('cssProdCatTreeNodeIconClosed');
   });



   /**
    * On a leaf node link click that should only expand but can't (since it's a leaf) (some use cat names as separators in this matter)
    */
   $(document).on('click', '.cssProdCatTreeLeafNode > .cssProdCatExpandOnlyLink', function(oEvent) {
      oEvent.preventDefault();
   });

});



$(document).ready(function() {
   $('#bodyTplEdit #logo-resize').click(function(e) {
      e.preventDefault();
      var $this = $(this),
          orgBlock = $this.parent();

      orgBlock.hide();
      orgBlock.siblings('.resize-logo').show();

      $('.resize-logo .btn-danger').click(function(e) {
         e.preventDefault();
         $('.resize-logo').hide();
         orgBlock.show();
      });

      $('.resize-logo .btn-success').click(function(e) {
         e.preventDefault();

         $.ajax({
            url: getShopUrl('/admin/image-manager/resize-logo'),
            data: { 'iHeight': $('#logo-height').val(), 'iWidth': $('#logo-width').val() },
            type: 'post',
            dataType: 'json',
            timeout: 5000,
            success: function(data) {
               $('.resize-logo').hide();
               orgBlock.show();
            }
         });

      });
   });
});