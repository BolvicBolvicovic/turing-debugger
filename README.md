# The Turing Debugger

This project has two goals:

- Give a practical tool to debug programs created for the Turing Machine I built.
- Take my NodeJs knowledge to a new level.

# Features

- Breakpoints
- Stepper
- Overwrite data
- Vizualiser

# Plan

- [ ] Run the program passed as argument.
- [ ] Connect to the program via an http server (the Turing Machine would run in a special debug mode).
- [ ] Being able to add breakpoints, run the program and resume the program.
- [ ] Being able to step forward (and possibly backward)
- [ ] Being able to overwrite data from a whole transition to the read/written value.
- [ ] Having a nice vizualisation tool.

# Structure

```
project-root/
├── src/
│   ├── server/                   # Code for managing the debug server process
│   │   ├── launcher.ts           # Spawns the server as a child process
│   │   ├── monitor.ts            # Watches process, restarts, captures logs
│   │   └── server.types.ts       # Types/interfaces for process management
│   │
│   ├── client/                   # Handles communication with the spawned server
│   │   ├── connection.ts         # IPC/TCP/stdin-stdout connection handling
│   │   ├── protocol.ts           # Protocol encoding/decoding
│   │   └── commands.ts           # High-level commands (step, break, etc.)
│   │
│   ├── core/                     # Core debugger logic (state, orchestration)
│   │   ├── debugger.ts           # Central coordinator
│   │   ├── breakpoints.ts        # Breakpoint handling
│   │   ├── memory.ts             # Memory read/write helpers
│   │   └── symbols.ts            # Symbol parsing/lookup
│   │
│   ├── ui/                       # User interface
│   │   ├── cli.ts                # CLI input handling
│   │   └── renderer.ts           # Output formatting
│   │
│   ├── utils/                    # Shared utilities
│   │   ├── logger.ts             # Logging
│   │   └── parser.ts             # Binary/data parsing
│   │
│   ├── config/                   # Config (paths, env, launch args)
│   │   └── index.ts
│   │
│   └── index.ts                  # Main entry point (ties everything together)
│
├── tests/                        # Tests
│   ├── server/launcher.test.ts
│   ├── client/protocol.test.ts
│   └── core/debugger.test.ts
│
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```
