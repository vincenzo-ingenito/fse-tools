<script>
import "../app.css";
import Header from "./Header.svelte";
 
let bodyStyle = "bg-gray-900 text-white p-4"; 
</script>

<Header />

<body>
<slot />
</body>
