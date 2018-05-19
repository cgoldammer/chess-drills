# Chess drills

This is a tool to go through chess drills. Right now, to run the app with your own drills, you'll need to compile it yourself. Let me know if you're interested in having a full tool that allows entering your own drills in the frontend. Right now, I haven't built that because the tool works fine for me personally even without a backend.

Features:
- Read a list of drills from a JSON file
- Show the drills in a clickable table
- For each drill, show the answer upon request, and then note whether you got the answer right or wrong
- The table logs your performance
- Drills are selected smartly. For instance, a drill won't repeat immediately, and drills that you have gotten right many times are selected less often.
