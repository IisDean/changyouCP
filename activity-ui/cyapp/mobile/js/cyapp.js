$(function () {
   // setOpenId("1");
});
function setOpenId(val) {
    localStorage.setItem("openId", val);
}
function getOpenId() {
    return localStorage.getItem("openId");
}