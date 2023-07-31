fixes:
    1 - look up 'share state between components without redux'
    2- use onAuthStateChange with reacthooks/ figure out how to validate user is logged in before page loads / figure out how to effectively call authentication function
    3- unique key for map fix https://stackoverflow.com/questions/71221877/react-is-it-okay-to-use-react-children-toarray-to-fix-each-child-in-a-list-shou
    4- check for unused css
    5- Navigation.css for fixed navbar:
        z-index: 100;
        width: 100%;
        position: fixed;
    6- figure out how to clear input after modal appears for forgotpassword
    7- might not need setAuth in files other than app.tsx now that app.tsx useeffect depends on auth.currentuser changing and calls setAuth itself
    8- figure out how to update profile without page reload
    9- address code where i set a string | null variable to a string variable with ! operator
    10. make sure the css is the same across all components
    11 - figure out sizing for elements so things like the profile toggle in navigation bar arent squashed
    12 - iron out correct use of quill https://codesandbox.io/s/weathered-framework-vo72w?file=/src/MyEditor.jsx:2805-2809
    13 - see how long URL.toObjectUrl() blob:http image lasts https://stackoverflow.com/questions/13966186/how-long-does-a-blob-persist
    14 - decide whether or not keeping image size when looking at post preview is worth it. probably consider using getbase64Image function from https://codesandbox.io/s/weathered-framework-vo72w?file=/src/MyEditor.jsx:1650-1664
    15 - think about using usememo for calculations https://stackoverflow.com/questions/70851686/how-to-add-custom-handlers-in-react-quill-modules-when-toolbar-is-array-of-optio
    16 - consider change all nulls to undefined that you can 
        https://medium.com/@o_o_o/null-vs-undefined-can-i-use-only-one-a3b7db5468f2
    17 - fix coverFile not being populated when you come back to /create-post after going to /blog-preview
    18 - IsAdmin resolving to true if it was previously true and set to tokenResult.claims.admin which is undefined
    19 - scroll to top when route changes https://dev.to/kunalukey/scroll-to-top-when-route-changes-reactjs-react-router-3bgn
    20 - make it so entire card can be clicked to view the post
    21 - figure out a way to save pictures so theyre easily identifiable with the post they come from
    22 - fix try catch logic for upload handler
    23 - refine checking for auth before render firebase https://www.tutorialrepublic.com/faq/how-to-determine-if-variable-is-undefined-or-null-in-javascript.php
        maybe use Context/Providers
    24 - make navbar return back to its place when link is clicked
    25 - fix cover image not saving after clicking preview

dependencies:
    react-quill: https://www.npmjs.com/package/react-quill
    quil-image-resize-module-react https://www.npmjs.com/package/quill-image-resize-module-react

important links:
    https://docs.emmet.io/abbreviations/syntax/
    https://console.firebase.google.com/u/0/project/fireblogsyt-f77cc/usage 

https://github.com/typescript-cheatsheets/react#basic-prop-types-examples

firebase functions: https://firebase.google.com/docs/functions/get-started?hl=en&authuser=0&gen=2nd

double render strictmode fix https://www.youtube.com/watch?v=81faZzp18NM

how to disable hosting https://stackoverflow.com/questions/42591099/how-do-i-remove-a-hosted-site-from-firebase