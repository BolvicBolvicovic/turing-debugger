# The Turing Debugger

![Debugger view when used with the UTM](public/debugger_with_utm.png 'Debugger view when used with the UTM')

This project has two goals:

- Give a practical tool to debug programs created for the Turing Machine I built.
- Take my NodeJs knowledge to a new level.

# Features

- Breakpoints
- Stepper
- Vizualiser
- Overwrite data

# Usage

## Setup

> [!WARNING]
> Be sure that the `ft_turing` project is correctly set up. Follow the instructions in the related `README`.
> Note that it is easier to build an oCaml project in a UNIX environement.
> Be sure that you are using the right opam switch.

- At the root of the repository, create a `.env` file containing:
  - [ ] `NODE_TM_PATH=~/path/to/ft_turing/folder`
- Run `pnpm i && pnpm link`

## Command Line Interface

### Basic Usage

```bash
turing-debugger <machineFile> <machineInput> [options]
```

**Arguments:**

- `<machineFile>` - Path to the Turing machine definition file (relative to NODE_TM_PATH)
- `<machineInput>` - Input string for the Turing machine

**Options:**

- `-s, --assembly-file <path>` - Path to locate the assembly code file related to the Turing machine program
- `-h, --help` - Display help for command
- `-V, --version` - Display version number

**Examples:**

```bash
# Basic usage
turing-debugger machines/unary_add.json "111+11="

# With assembly file for enhanced debugging
turing-debugger machines/binary_add.json "101+011=" -s assembly/binary_add.asm
```

## Interactive Debugger Commands

Once the debugger starts, you can use these keyboard shortcuts to control execution:

### Navigation & Control

- **`h`** - Toggle help panel
- **`q`**, **`Ctrl+C`**, or **`Escape`** - Quit debugger
- **`w`** - Start writing in the selected input/panel

### Execution Control

- **`s`** - Step through one transition
- **`r`** - Run until the next breakpoint or halt

### Panel Navigation

- **`c`** - Select the Code panel
- **`t`** - Select the Tape panel
- **`b`** - Select the Breakpoints panel
- **`i`** - Select the Transitions panel

### Tape Operations

- **Left/Right arrows** - Navigate the tape
- **`o`** - Go to the origin of the tape
- **`e`** - Go to the end of the tape
- **`f`** - Find the head of the tape

### Breakpoint Management

- **`w`** (in Breakpoints panel) - Start writing to add a breakpoint
- **`Enter`** (while writing) - Add the breakpoint
- **`f`** (in Breakpoints panel) - Access breakpoint list and enable scrolling
- **Up/Down arrows** (in list mode) - Navigate breakpoints
- **Left/Right arrows** (in list mode) - Scroll the breakpoint message
- **`d`** (in list mode) - Delete the selected breakpoint

### Transitions Panel

- **`Space`** - Wrap/unwrap the selected transition
- **Up/Down arrows** - Navigate transitions vertically
- **Left/Right arrows** - Navigate transitions horizontally
- **`f`** - Find the current transition

### Search & Help

- **`f`** - Start finding/searching in the selected panel
- **Up/Down arrows** - Navigate search results
- **`Escape`** - Stop searching

### Getting Help

- Type **`help`**, **`step`**, **`run`**, **`breakpoints`**, **`tape`**, **`transitions`**, or **`code`** in the help search to get specific guidance for each feature

# Plan

- [x] Run the program passed as argument
- [x] Connect to the program via an http server (the Turing Machine runs in a special debug mode, exposing the following HTTP request/path: GET "/step", GET "/run", POST/DELETE "/breakpoint)
- [x] Being able to add breakpoints, run the program and resume the program.
- [x] Being able to step forward
- [x] Being able to visualize states and transitions in a nice way
- [x] Being able to search commands in a manuel through an input
- [ ] Being able to step backward
- [ ] Being able to overwrite data from a whole transition to the read/written value
- [ ] Being able to overwrite registers when they exist
- [ ] Write tests units

# Structure

```
project-root/
├── .vscode/                         # VS Code configuration
│   ├── extensions.json
│   └── settings.json
├── dist/                           # Compiled JavaScript output
├── src/
│   ├── cli/                        # Command-line interface
│   │   ├── cli.types.ts           # CLI-related type definitions
│   │   ├── index.ts               # CLI module exports
│   │   └── init.ts                # CLI initialization and argument parsing
│   │
│   ├── client/                     # Communication with the Turing machine process
│   │   └── commands.ts            # High-level debugging commands (step, run, breakpoints)
│   │
│   ├── debuggee/                   # Target process management
│   │   ├── index.ts               # Process launcher and manager
│   │   ├── setup.ts               # Process initialization
│   │   └── cleanup.ts             # Process cleanup and termination
│   │
│   ├── man/                        # Manual/help system
│   │   └── index.ts               # Interactive help and command search
│   │
│   ├── ui/                         # React-based terminal UI (using Ink)
│   │   ├── root.tsx               # Main UI component
│   │   ├── breakpoints/           # Breakpoint management UI
│   │   │   ├── index.tsx
│   │   │   └── utils.ts
│   │   ├── code/                  # Code display panel
│   │   │   └── index.tsx
│   │   ├── components/            # Reusable UI components
│   │   │   └── input.tsx
│   │   ├── constants/             # UI constants and configuration
│   │   │   └── main.constants.ts
│   │   ├── helper/                # Help panel component
│   │   │   └── index.tsx
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── tape/                  # Turing machine tape visualization
│   │   │   └── index.tsx
│   │   ├── transitions/           # State transitions display
│   │   │   └── index.tsx
│   │   └── types/                 # UI-related type definitions
│   │       ├── breakpoints.type.ts
│   │       └── panels.type.ts
│   │
│   ├── utils/                      # Shared utilities
│   │   ├── lib.ts                 # General utility functions
│   │   ├── parser.ts              # Turing machine definition parser
│   │   ├── provider.ts            # Data providers and state management
│   │   └── types/                 # Utility type definitions
│   │       ├── lib.types.ts
│   │       ├── parser.types.ts
│   │       └── provider.types.ts
│   │
│   └── index.ts                    # Main entry point and application orchestrator
│
├── .env                           # Environment configuration (NODE_TM_PATH)
├── .eslintignore                  # ESLint ignore patterns
├── .gitignore                     # Git ignore patterns
├── .prettierignore                # Prettier ignore patterns
├── .prettierrc                    # Prettier configuration
├── eslint.config.js              # ESLint configuration
├── package.json                   # Dependencies and scripts
├── pnpm-lock.yaml                # Package manager lockfile
├── tsconfig.json                  # TypeScript configuration
├── LICENSE                        # License file
└── README.md                      # Project documentation
```
