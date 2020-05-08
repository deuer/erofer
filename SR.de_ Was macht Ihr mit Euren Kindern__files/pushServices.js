/**

 PushServices.js
 Autor: Sascha Reinshagen
 Support: FF,GC,AS
 **/

const safariPushService = "https://push.sr.de/push";
const safariPushID = "web.de.sr.push";
const pushRegister = "https://push.sr.de/";
const applicationKey = 1;
const applicationServerKey = "BNmNM6x95Jw9CKw1qlcwETjhCAJ2oJ_9doAhpOgntAbfEVhLowdGBZ-t7qZAO5dOLrp6zs9dR1RJiq4qy2DXg9M";


function checkSupport()
{
    if (('serviceWorker' in navigator)) {

        if (('safari' in window && 'pushNotification' in window.safari)) {

            openSafariHandle();

            //requestPushPermissionSafari();

            return;
        } else {

            requestPushPermissionChrome();

            return;
        }


        return;
    } else if (('PushManager' in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        requestPushPermissionChrome();

        return;
    } else {
        requestPushPermissionChrome();
    }
}

function openSafariHandle()
{

    if(accessCookie("push") == "")
    {
        $("#safariPushCon").show();
    } else if(accessCookie("push") == "true") {
        requestPushPermissionSafari();
    }
}

function createCookie(name, val, days)
{
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    document.cookie = name + "=" + val + "; expires=" + date.toGMTString();
}

function accessCookie(cookieName)
{
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i<allCookieArray.length; i++)
    {
        var temp = allCookieArray[i].trim();
        if (temp.indexOf(name)==0)
            return temp.substring(name.length,temp.length);
    }
    return "";
}

function hideSafariHandle()
{
    $("#safariPushCon").hide();

    if(accessCookie("push") == "")
    {
        createCookie("push", false, 365);
    }
}

function requestPushPermissionSafari()
{
    var permissionData = window.safari.pushNotification.permission('web.de.sr.push');

    checkRemotePermissionSafari(permissionData);
}

function requestPushPermissionChrome()
{
    navigator.serviceWorker.register("/sr/serviceWorker.js")
        .then(() => {
            console.log('[SW] Service worker has been registered');
            registerSubscriptionChrome();
            updateSubscriptionChrome();
        }, e => {
            console.error('[SW] Service worker registration failed', e);
        })
        .then(function (reg) {
            navigator.serviceWorker.addEventListener('message', function (event) {
                // Bei Eilmeldungen Eilmeldung einblenden

                console.log(event);
            });
        })
        .catch(function(error) {
            console.error('Service Worker registration error : ', error);
        });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function registerSubscriptionChrome() {

    if(navigator == undefined)
        console.log("navigator not defined");

    if(navigator.serviceWorker == undefined)
        console.log("serviceWorker is undefined");

    console.log(navigator.serviceWorker);

    navigator.serviceWorker.ready
        .then(serviceWorkerRegistration => {

            console.log("Trying to Subscribe");

            serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
        })})
        .then(subscription => {
            // Subscription was successful
            // create subscription on your server
            console.log(subscription);

            return updateServerSubscription(subscription, 'POST');
        })
        .catch(e => {
            if (Notification.permission === 'denied') {
                // The user denied the notification permission which
                // means we failed to subscribe and the user will need
                // to manually change the notification permission to
                // subscribe to push messages
                console.warn('Notifications are denied by the user.');
            } else {
                // A problem occurred with the subscription; common reasons
                // include network errors or the user skipped the permission
                console.error('Impossible to subscribe to push notifications', e);
            }
        });

}

function updateSubscriptionChrome()
{
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
        .then(subscription => {

            if (!subscription) {
                // We aren't subscribed to push, so set UI to allow the user to enable push
                return;
            }
            // Keep your server in sync with the latest endpoint
            return updateServerSubscription(subscription, 'PUT');
        })
        .then(subscription => subscription) // Set your UI to show they have subscribed for push messages
        .catch(e => {
            console.error('Error when updating the subscription', e);
        });
}

function updateServerSubscription(subscription, method) {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');
    const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

    return fetch('https://push.sr.de/?platform=browser', {
        method,
        body: JSON.stringify({
            endpoint: subscription.endpoint,
            publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
            authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
            abos: "all",
            contentEncoding,
        }),
    }).then(() => subscription);
}

function checkRemotePermissionSafari(permissionData)
{
    console.log(accessCookie("push"));
    if (permissionData.permission === 'default') {

        if(accessCookie("push") != "") {
            createCookie("push", "", -1);
        }

        window.safari.pushNotification.requestPermission(safariPushService, safariPushID, {}, checkRemotePermissionSafari);

    }
    else if (permissionData.permission === 'denied') {

    }
    else if (permissionData.permission === 'granted') {

        if(accessCookie("push") == "")
        {
            createCookie("push", true, 365);
            hideSafariHandle();
        }

        $.post(pushRegister+"?platform=browser&agent=safari", JSON.stringify(permissionData), (responseData) => {

        });

    }
}

$(document).ready(function () {
    checkSupport();
});