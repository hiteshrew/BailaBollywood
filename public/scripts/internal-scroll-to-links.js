//Select all the elements from the html page  where you want to scroll to go.

//Here we select the element with id=about (About Baila Bollywood)

const aboutUS=document.getElementById('about');
console.log(aboutUS);
//Here we select the element with id=blog (The blogs section (with Swiper))

const siteBlog=document.getElementById('blogs');
console.log(siteBlog);
//Here we select the element with id=pop-categ (The Popular Category Section)

const popularCategory=document.getElementById('pop-categ');
console.log(popularCategory);
//Here we select the element with id=found-note (The Founders Note Section)

const founderNote=document.getElementById('found-note');
console.log(founderNote);

/*
    Apply onlcik() events in the list items of navbar.
    So that once you click on any link then you will
    be redreted to that section within the respective
    page.
*/

/*
    Get all the anchor tag list items if navbar using className selector.
    Here we get an HTMLCollection object which is just and array of the
    navbar link items.
*/

let navbarListItems=document.getElementsByClassName('nav-link');
console.log(navbarListItems);

/*
We will not add an event listener on the first member of this list because
 it itself redirectd to the homepage.
 */

//Add an onlclick event listener on the Second item of this list which is ( Quiénes Somos)

navbarListItems[1].addEventListener('click',function(e){
    e.preventDefault();
    aboutUS.scrollIntoView();
});

//Add an onlclick event listener on the Third item of this list which is ( Nuestro Blog)

navbarListItems[2].addEventListener('click',function(e){
    e.preventDefault();
    siteBlog.scrollIntoView();
});

//Add an onlclick event listener on the Fourth item of this list which is ( Lo más Popular)

navbarListItems[3].addEventListener('click',function(e){
    e.preventDefault();
    popularCategory.scrollIntoView();
});

//Add an onlclick event listener on the Fifth item of this list which is ( Nuestro Fundador)

navbarListItems[4].addEventListener('click',function(e){
    e.preventDefault();
    founderNote.scrollIntoView();
});