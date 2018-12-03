#!/usr/bin/env node

import { relink } from "./actions/relink";

relink(process.env.INIT_CWD);