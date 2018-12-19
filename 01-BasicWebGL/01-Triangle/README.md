# Triangles

So, the tutorials on [LearnOpenGL.com](https://learnopengl.com/Getting-started) starting with creating an OpenGl Context and open up the first window.
This is simply done in HTML / Javascript by adding any Canvas Element to your (as allways structured) HTML and call the following
lines in Javascript:
```javascript
let canvas = document.getElementById('canvas');
let context = canvas.getContext('webgl2');
```

We will use WegGl2 Context since it provides us more options like VAOs'n'Stuff...

So after we got our Context, its time to get Triangles, the Hello World Example of OpenGL!
As Explained one Level obove in the this Repository, i will use some BaseStack that gives me the Context
and provides me an easy way to load in Shaders!

---
related Tutorials: \
[LearnOpenGL.com - Hello Triangle](https://learnopengl.com/Getting-started/Hello-Triangle)

after this said, check out the Triangles Tutorial on LearnOpenGL.com and try to understand the few Files in
the ``/src`` folder!
