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
/** @var string - Get: Div name to hide/show */
var sDivName = 'cssBtnBuy';

/** @var string - Get: Location to article list */
var sLocationArtList = location.pathname;
if (!sLocationArtList){alert("ERROR: sLocationArtList is NOT set in ArtList. Please contact support@starweb.se with this error message.");}



var sChrStop;
var sUrlBtnBuyPty = "";
var sUrlArtImg;
var sImgArtNameDefault;
var sArtModelIdSel = "";
var bIsViewCost;
var iDbId;
var sDbArtModelId;
var fDbWeightNr;
var fRetailPriceInclExclVat;
var sRetailPriceInclExclVatFormatted;
var sOriginalRetailPriceInclExclVatFormatted;
var sDbStockStatusTransl;
var sLangStockStatusIsEmpty;
var sUrlImgSoft_1;
var sImgFileName_1;
var iWdtNr_1;
var iHgtNr_1;
var bIsImgIsArtItemAutoZoom;
var bIsImgIsArtHighslide;
var iSetupShopSizeNr;
var iArtPrmTotalNr;
var iArtPrm_DataTotalNr;
var aArtPrm_DataUniqueIdItem;
var aImgArtPrmItem;
var sArtManufacturerModelId;






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Set Article Item Settings
 * @access public
 */
function SetArtItemSett(sChrStopSett, sArtNameSett, sUrlArtImgSett, sImgArtNameDefaultSett, bIsViewCostSett,iDbIdSett, sDbArtModelIdSett, fDbWeightNrSett,
   fRetailPriceInclExclVatSett, sRetailPriceInclExclVatFormattedSett, sOriginalRetailPriceInclExclVatFormattedSett, sDbStockStatusTranslSett, sLangStockStatusIsEmptySett, sUrlImgSoft_1Sett, sImgFileName_1Sett,
   iWdtNr_1Sett, iHgtNr_1Sett,  bIsImgIsArtItemAutoZoomSett, bIsImgIsArtHighslideSett, iSetupShopSizeNrSett, iArtPrmTotalNrSett, iArtPrm_DataTotalNrSett,
   sArtManufacturerModelIdSett)
{
   sChrStop                         = sChrStopSett;
   sArtName                         = sArtNameSett;
   sUrlArtImg                       = sUrlArtImgSett;
   sImgArtNameDefault               = sImgArtNameDefaultSett;
   bIsViewCost                      = bIsViewCostSett;
   iDbId                            = iDbIdSett;
   sDbArtModelId                    = sDbArtModelIdSett;
   fDbWeightNr                      = fDbWeightNrSett;
   fRetailPriceInclExclVat          = fRetailPriceInclExclVatSett;
   sRetailPriceInclExclVatFormatted = sRetailPriceInclExclVatFormattedSett;
   sOriginalRetailPriceInclExclVatFormatted = sOriginalRetailPriceInclExclVatFormattedSett;
   sDbStockStatusTransl             = sDbStockStatusTranslSett;
   sLangStockStatusIsEmpty          = sLangStockStatusIsEmptySett;
   sUrlImgSoft_1                    = sUrlImgSoft_1Sett;
   sImgFileName_1                   = sImgFileName_1Sett;
   iWdtNr_1                         = iWdtNr_1Sett;
   iHgtNr_1                         = iHgtNr_1Sett;
   bIsImgIsArtItemAutoZoom          = bIsImgIsArtItemAutoZoomSett;
   bIsImgIsArtHighslide             = bIsImgIsArtHighslideSett;
   iSetupShopSizeNr                 = iSetupShopSizeNrSett;
   iArtPrmTotalNr                   = iArtPrmTotalNrSett;
   iArtPrm_DataTotalNr              = iArtPrm_DataTotalNrSett;
   sArtManufacturerModelId          = sArtManufacturerModelIdSett;
}






/**
 * Set Article Item Field Value List
 * @access public
 */
function SetArtItemFldValList()
{
   // Get: Is there article parameters?
   var frmArtItem = document.forms['frmArtItem'];
   var oArtPrm_0  = frmArtItem.elements['aItem[oArtPrm_0]']; // MUST BE FOUND BY NAME DUE TO LABEL IS IDENTIFIED BY ID!
   var sStockStatusSel, fArtWeightNrSel, fRetailPriceInclExclVatSel, sRetailPriceInclExclVatFormattedSel, sOriginalRetailPriceInclExclVatFormattedSel, sArtManufacturerModelIdSel;
   var i, j, iUniqueIdRowNr;
   var sUniqueId            = "";
   var iArtQtyNr            = 1;
   var oArtQtyNrTxtBox      = document.getElementById("aItem[iArtQtyNr]");
   var sWarnMsg;



   switch (true)
   {
      // ARTICLE PARAMETER
      case ((oArtPrm_0 != "") && (oArtPrm_0 != undefined)):
         // Loop: Through all fields in array
         for (i=0, j=1; i<iArtPrmTotalNr; i++, j++)
         {
            // Get: Article parameter object
            var oArtPrmObj = frmArtItem["aItem[oArtPrm_"+ i +"]"]; // MUST BE FOUND BY NAME SINCE LABEL IS IDENTIFIED BY ID!


            /* Article parameter exists, set article parameter cost - Start */
            if (oArtPrmObj)
            {
               switch (true)
               {
                  // RADIO BUTTON
                  case (oArtPrmObj.type == "radio"):
                  case ((oArtPrmObj.type == undefined) && (oArtPrmObj.checked == undefined) && (oArtPrmObj.length > 0)): // Several radio buttons
                     // Check: If several radio buttons per parameter
                     if (oArtPrmObj.length > 0)
                     {
                        for (var k=0; k<oArtPrmObj.length; k++)
                        {
                           // Check: That value is checked
                           if (oArtPrmObj[k].checked)
                           {
                              sUniqueId += oArtPrmObj[k].value;
                              break;
                           }
                        }
                     }
                     // Check: Only ONE radio button per parameter
                     else if (oArtPrmObj.checked == true)
                     {sUniqueId += oArtPrmObj.value;}
                     break;


                  // SELECT LIST
                  default:
                     // Get: Selected article parameter id
                     if (oArtPrmObj.options)
                     {sUniqueId += oArtPrmObj.options[oArtPrmObj.selectedIndex].value;}
                     break;
               }


               // Set: Add value to total unique id string
               if (iArtPrmTotalNr != j)
               {sUniqueId += sChrStop;}
            }
            /* Article parameter exists, set article parameter cost - End */
         }


         if (sUniqueId)
         {
            // Loop: Through all fields in array
            for (iUniqueIdRowNr=0; iUniqueIdRowNr<iArtPrm_DataTotalNr; iUniqueIdRowNr++)
            {
               if (aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId])
               {
                  sArtModelIdSel                              = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["ModelId"];
                  sStockStatusSel                             = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["sStockStatusTransl"];
                  sArtManufacturerModelIdSel                  = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["ManufacturerModelId"];
                  fArtWeightNrSel                             = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["WeightNr"];
                  fRetailPriceInclExclVatSel                  = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["fRetailPriceInclExclVat"];
                  sRetailPriceInclExclVatFormattedSel         = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["sRetailPriceInclExclVatFormatted"];
                  sOriginalRetailPriceInclExclVatFormattedSel = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["sOriginalRetailPriceInclExclVatFormatted"];
                  //sImgArtPrmName                    = aArtPrm_DataUniqueIdItem[iUniqueIdRowNr][sUniqueId]["Img"];

                  break;
               }
            }
         }
         break;



      // _NO_ ARTICLE PARAMETER
      default:
         sArtModelIdSel                              = sDbArtModelId;
         sStockStatusSel                             = sDbStockStatusTransl;
         sArtManufacturerModelIdSel                  = sArtManufacturerModelId;
         fArtWeightNrSel                             = fDbWeightNr;
         fRetailPriceInclExclVatSel                  = fRetailPriceInclExclVat;
         sRetailPriceInclExclVatFormattedSel         = sRetailPriceInclExclVatFormatted;
         sOriginalRetailPriceInclExclVatFormattedSel = sOriginalRetailPriceInclExclVatFormatted;
         break;
   }



   // Set: Model id, stock status, weight number, url to insert article in cart
   $('#cssArtItemModelId').text(sArtModelIdSel);
   SetStockStatusTxtBox(sStockStatusSel);
   SetWeightNrTxtBox(fArtWeightNrSel);
   SetImgArtPrm(sUniqueId, iUniqueIdRowNr);


   // Set: Manufacturer's ModelId
   if (sArtManufacturerModelIdSel)
   {
      $('#cssArtItemManufacturerModelId').text(sArtManufacturerModelIdSel)
      $('#cssArtItemManufacturerModelIdCon').show();
   }
   else
   {
      $('#cssArtItemManufacturerModelId').text('');
      $('#cssArtItemManufacturerModelIdCon').hide();
   }


   // Set: Cost text boxes
   SetArtCostTxtBoxList(sRetailPriceInclExclVatFormattedSel, sOriginalRetailPriceInclExclVatFormattedSel);


   // Check: If Klarna part payment is installed and should be shown
   if ($('#cssArtItemKlarnaPartPayCon').length)
   {
      $.get(sBaseUrl +'/Shop/Page/pgAjaxLoad.php', {sFunc: 'ArtItemKlarnaPartPay', fPurchaseAmountNr: fRetailPriceInclExclVatSel}, function(sData) {
         $('#cssArtItemKlarnaPartPayCon').replaceWith(sData);
      });
   }

   // Trigger for custom even listeners
   $(document).trigger('prodViewPrmChange');
}






/**
 * Set Article Cost Text Box List
 * @access private
 *
 * @param string sRetailPriceInclExclVatFormattedSel
 * @param string sOriginalRetailPriceInclExclVatFormatted
 */
function SetArtCostTxtBoxList(sRetailPriceInclExclVatFormattedSel, sOriginalRetailPriceInclExclVatFormattedSel)
{
   if (bIsViewCost == true)
   {
      var priceField = $('.cssArtItemCostExclVatNr');
      if (priceField.length)
      {  priceField.text(sRetailPriceInclExclVatFormattedSel); }

      var originalPriceField = $('.cssArtItemCost .cssArtCostDiscountExclVatNr');
      if (originalPriceField.length)
      {
         sOriginalPriceText = (sRetailPriceInclExclVatFormattedSel != sOriginalRetailPriceInclExclVatFormattedSel) ? sOriginalRetailPriceInclExclVatFormattedSel : '';
         originalPriceField.text(sOriginalPriceText);
      }
   }
}






/**
 * Set Stock Status Text Box
 * @access private
 *
 * @param {array} sStockStatus
 */
function SetStockStatusTxtBox(sStockStatus)
{
   // Check: That stock status field exist
   if ($('#cssArtItemStockStatusCon').length)
   {
      // Set: Stock value
      $('#cssArtItemStockStatus').text(sStockStatus);

      // Hide: Stock label/text if stock value is empty
      if (!sStockStatus)
      {  $('#cssArtItemStockStatusCon').hide(); }
      else
      {  $('#cssArtItemStockStatusCon').show(); }
   }

   // Set: Hide or show buy button and quantity field
   if (sStockStatus == sLangStockStatusIsEmpty)
   {
      DivToggle(sDivName, 0);
      DivToggle('cssArtItemArtQtyNrCon', 0);
   }
   else
   {
      DivToggle(sDivName, 1);
      DivToggle('cssArtItemArtQtyNrCon', 1);
   }
}






/**
 * Set Weight Number Text Box
 * @access private
 *
 * @param float fArtWeightNr
 */
function SetWeightNrTxtBox(fArtWeightNr)
{
   if ($('#cssArtItemWeightNrCon').length)
   {
      fArtWeightNr = parseFloat(fArtWeightNr);

      if (fArtWeightNr)
      {
         // Get: Weight number string
         if (fArtWeightNr < 1)
         {
            var sArtWeightNr  = (fArtWeightNr * 1000);
            sArtWeightNr     += ""; // Force string

            // Set: Max number of decimals
            sArtWeightNr = sArtWeightNr.substring(0, 7);

            sArtWeightNr += " gram";
         }
         else
         {  sArtWeightNr = fArtWeightNr +" kg";}


         $('#cssArtItemWeightNr').text(sArtWeightNr);
         $('#cssArtItemWeightNrCon').show();
      }
      else
      {
         $('#cssArtItemWeightNrCon').hide();
         $('#cssArtItemWeightNr').text('');
      }
   }
}






/**
 * Set Image Article Parameter
 * @access private
 *
 * @param string sUniqueId
 * @param int iUniqueIdRowNr
 */
function SetImgArtPrm(sUniqueId, iUniqueIdRowNr)
{
   // Get: Settings
   //var oArtImg_1    = document.getElementById("oArtItemImg_1");
   var oArtImg_1    = document.getElementById("cssArtItemImg_1");
   var oArtDivImg_1 = document.getElementById("cssImg_1");

   if (oArtImg_1)
   {
      switch (true)
      {
         // GET: Selected article parameter image
         case ((sUniqueId != "") && (iUniqueIdRowNr != undefined) && (iSetupShopSizeNr > 2)):
            if (aImgArtPrmItem[iUniqueIdRowNr][sUniqueId] != "")
            {
               switch (true)
               {
                  // Check: That it's an SWF flash movie
                  case (aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"].indexOf(".swf") != -1):
                     // Get: Image html (oArtItemImg_1 must be present)
                     var sImgHtml = "<div id=\"oArtItemImg_1\"> </div>";

                     // Get: SWF flash video html
                     var sSwfFlashVideoHtml = GetSwfFlashMovieHtml(
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"],
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iWdtNr"],
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iHgtNr"]
                     );
                     var sHrefHtml = (bIsImgIsArtItemAutoZoom == true)
                        ? "<a id=\"aUrlArtItemImg_1\" onmouseover=\"ImgPopupAutoZoomShow(this,'Flash','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"].replace(" ", "%20") +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgWdtNr"] +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgHgtNr"] +"')\" onmouseout=\"ImgPopupAutoZoomHide()\" class=\"highslide\" onclick=\"return hs.htmlExpand(this, {objectType:'swf', objectWidth:'"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgWdtNr"] +"', objectHeight:'"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgHgtNr"] +"', align:'center', allowSizeReduction:false})\" href=\""+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"] +"\">"
                        : "<a id=\"aUrlArtItemImg_1\" class=\"highslide\" onclick=\"return hs.htmlExpand(this, {objectType:'swf', objectWidth:'"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgWdtNr"] +"', objectHeight:'"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgHgtNr"] +"', align:'center', allowSizeReduction:false})\" href=\""+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"] +"\">";


                     var iRandNr = Math.random();
                     iRandNr     = Math.floor(iRandNr * 100);

                     var sImgTransparentHtml = "<div><div>"+ sHrefHtml;
                         sImgTransparentHtml +="<img id=\"cssImgTransparentNr_"+ iRandNr +"\" src=\""+ sBaseUrl +"/Shop/Image/Pixel.gif\" class=\"cssImgTransparent cssIeOpacity\" />";
                         sImgTransparentHtml +="<style type=\"text/css\">.cssImg #cssImgTransparentNr_"+ iRandNr +" {height:"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iHgtNr"] +"px; width:"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iWdtNr"] +"px;}";
                         sImgTransparentHtml +=".cssArtItemImgThumbGallery #cssImgTransparentNr_"+ iRandNr +" { height:"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iWdtNr"] +"px; width:"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iHgtNr"] +"px; background-color:red; display:block; z-index:2; position:absolute; margin:0px;}";
                         sImgTransparentHtml +="</style><img class=\"cssMovieIcon\" src=\""+ sBaseUrl +"/Shop/Image/icon_movie_highslide.png\"/></a></div>"+ sSwfFlashVideoHtml +"</div>"+ sImgHtml +"</div>";


                     // View: Url and image
                     if (oArtDivImg_1)
                     {
                        // oArtDivImg_1.innerHTML = sHrefHtml + sSwfFlashVideoHtml + sImgHtml;
                        oArtDivImg_1.innerHTML = sImgTransparentHtml;
                     }

                     break;



                  // Check: That it's not the default image
                  case ((aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"].indexOf(sImgArtNameDefault) == -1)
                     && (aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"] != "")):
                     // Get: Image html
                     var sImgHtml = GetImgHtml(
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"],
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iWdtNr"],
                        aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iHgtNr"]
                     );
                     var sHrefHtml = (bIsImgIsArtItemAutoZoom == true)
                        ? "<a id=\"aUrlArtItemImg_1\" onmouseover=\"ImgPopupAutoZoomShow(this,'Img','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"].replace(" ", "%20") +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgWdtNr"] +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgHgtNr"] +"')\" onmouseout=\"ImgPopupAutoZoomHide()\" class=\"highslide\" onclick=\"return hs.expand(this)\" href=\"\">"
                        : "<a id=\"aUrlArtItemImg_1\" class=\"highslide\" onclick=\"return hs.expand(this)\" href=\"\">";

                     // View: Url and image
                     if (oArtDivImg_1)
                     {oArtDivImg_1.innerHTML = sHrefHtml + sImgHtml;}


                     // Set: Url
                     var oUrlArtItemImg_1 = document.getElementById("aUrlArtItemImg_1");
                     if (oUrlArtItemImg_1)
                     {oUrlArtItemImg_1.href = aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"];}


                     // Set: Image
                     oArtImg_1.src    = aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["sUrlImgSoft"];

                     // Set: Width/height
                     oArtImg_1.width  = aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iWdtNr"];
                     oArtImg_1.height = aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iHgtNr"];
                     break;



                  // Get: Image to first article image (default article image "-IngenBildVald-.jpg")
                  default:
                     // Get: Image html
                     var sImgHtml = GetImgHtml(
                        sUrlImgSoft_1,
                        iWdtNr_1,
                        iHgtNr_1
                     );
                     var sHrefHtml = (bIsImgIsArtItemAutoZoom == true)
                        ? "<a id=\"aUrlArtItemImg_1\" onmouseover=\"ImgPopupAutoZoomShow(this,'Img','"+ sUrlImgSoft_1.replace(" ", "%20") +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgWdtNr"] +"','"+ aImgArtPrmItem[iUniqueIdRowNr][sUniqueId]["iOrgHgtNr"] +"')\" onmouseout=\"ImgPopupAutoZoomHide()\" class=\"highslide\" onclick=\"return hs.expand(this)\" href=\"\">"
                        : "<a id=\"aUrlArtItemImg_1\" class=\"highslide\" onclick=\"return hs.expand(this);\" href=\"\">";


                     // View: Url and image
                     if (oArtDivImg_1)
                     {oArtDivImg_1.innerHTML = sHrefHtml + sImgHtml;}


                     // Set: Url
                     var oUrlArtItemImg_1 = document.getElementById("aUrlArtItemImg_1");
                     if (oUrlArtItemImg_1)
                     {oUrlArtItemImg_1.href  = sUrlImgSoft_1;}


                     // Set: Image
                     oArtImg_1.src = sUrlImgSoft_1;

                     // Set: Width/height
                     oArtImg_1.width  = iWdtNr_1;
                     oArtImg_1.height = iHgtNr_1;
                     break;
               }
            }
            else
            {
               // Set: Image to default article image "-IngenBildVald-.jpg"
               oArtImg_1.src = sUrlArtImg + sImgArtNameDefault;

               // Set: Width/height
               oArtImg_1.width  = iWdtNr_1;
               oArtImg_1.height = iHgtNr_1;
            }
            break;
      }
   }


}






/**
 * Get Image Html
 * @access private
 *
 * @param string $sUrlImgSoft
 * @param int $iWdtNr
 * @param int $iHgtNr
 *
 * @return string
 */
function GetImgHtml(sUrlImgSoft, iWdtNr, iHgtNr)
{
   var sImgHtml  = '<img src="' + sUrlImgSoft + '" id="oArtItemImg_1" class="cssImgBorder oArtItemImg_1" alt="' + sArtName + '" /></a>';

   var sScript  = '<style>\n';
       sScript += '#cssImg_1 { max-width: ' + iWdtNr + 'px; max-height: ' + iHgtNr + 'px; }\n';
       sScript += '#cssImg_1 a { display: block; line-height: 0px; }';
       sScript += '.oArtItemImg_1 { max-width: ' + iWdtNr + 'px; max-height: ' + iHgtNr + 'px; }\n';
       sScript += '</style>';

   return sImgHtml + sScript;
}






/**
 * Get SWF Flash Movie Html
 * @access private
 *
 * @param string $sUrlImgSoft
 * @param int $iWdtNr
 * @param int $iHgtNr
 *
 * @return string
 */
function GetSwfFlashMovieHtml(sUrlImgSoft, iWdtNr, iHgtNr)
{
   var sImgHtml;

   // Get: SWF flash movie html
   sImgHtml  = "<object id=\"cssSwf_1\" type=\"application/x-shockwave-flash\" data=\""+ sUrlImgSoft +"\" width=\""+ iWdtNr +"\" height=\""+ iHgtNr +"\">";
   sImgHtml += "<param value=\"opaque\" name=\"wmode\" />";
   sImgHtml += "<param value=\"\" name=\"flashvars\" />";
   sImgHtml += "<!--[if IE]>-->";
   sImgHtml += "<param name=\"movie\" value=\""+ sUrlImgSoft +"\" />";
   sImgHtml += "<!--<![endif]-->";
   sImgHtml += "</object>";

   return sImgHtml;
}






/**
 * Get Article Model Id Selected
 * @access public
 *
 * @return string
 */
function GetArtModelIdSel()
{
   return sArtModelIdSel;
}






/**
 * Get Char String In String
 * @access public
 *
 * Function was fetched from http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strstr/
 * http://kevin.vanzonneveld.net
 * +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 * +   bugfixed by: Onno Marsman
 *    example 1: GetChrStrStr('Kevin van Zonneveld', 'van');
 *    returns 1: 'van Zonneveld'
 *    example 2: GetChrStrStr('Kevin van Zonneveld', 'van', true);
 *    returns 2: 'Kevin '
 *
 * @param string haystack
 * @param string needle
 * @param boolean bool
 *
 * @return string
 */
function GetChrStrStr(haystack, needle, bool)
{
    var pos = 0;

    haystack += '';
    pos       = haystack.indexOf(needle);

    if ( pos == -1 ){
        return haystack;//return false;
    } else{
        if ( bool ){
            return haystack.substr(0, pos);
        } else{
            return haystack.slice(pos);
        }
    }
}






/**
 * Get an article item property.
 *
 * @param string sPropName
 * @return int|string|array
 */
function getArtItemProp(sPropName)
{
   var mProp = null;

   switch (sPropName)
   {
      case 'sModelId':
         mProp = sArtModelIdSel;
         break;
      case 'iArtQtyNr':
         var sArtQtyNr = $.trim($('#aItem\\[iArtQtyNr\\]').val());
         mProp = sArtQtyNr.match(/^\d+$/) ? parseInt(sArtQtyNr) : 1;
         break;
      case 'aArtCustomVals':

         var aArtCustomVals = [];

         // Get: Editable custom fields
         $('.cssArtItemCustomFldEditable').each(function()
         {
            // Check: That value is not empty (don't add if so)
            var sVal = $.trim($(this).val());
            if (sVal != '')
            {
               // Replace: ,-chars with .-chars if and strip all other chars if it is to be multipled
               if ($(this).data('multiply'))
               {
                  sVal = sVal.replace(',', '.');
                  sVal = sVal.replace(/[^0-9.]/g, '');
               }

               var iCustomFld_Id = $(this).data('id');
               aArtCustomVals[iCustomFld_Id] = sVal;
            }
         });

         // Get: Possible book format choice
         if ($('#sElibEbookFormat').length && $('#iElibEbookFormatsArtCustomFld_Id').length)
         {
            // Add: As custom field val
            var iArtCustomFld_Id = parseInt($('#iElibEbookFormatsArtCustomFld_Id').val());
            aArtCustomVals[iArtCustomFld_Id] = $('#sElibEbookFormat').val();
         }

         if (aArtCustomVals.length)
         {  mProp = aArtCustomVals; }

         break;
   }

   return mProp;
}
