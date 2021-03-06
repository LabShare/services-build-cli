'use strict';

import {buildService} from "../lib/build-service";
import {defaults} from 'lodash';
import {join} from "path";
import * as readPkg from 'read-pkg';
import {Command, flags} from '@oclif/command'

export class Build extends Command {
    static description = 'The services build CLI can be used to generate distributions for Node.js API projects.';

    static examples = [
        `$ services build`,
        `$ services build --destination ./dist --buildVersion 0.1.2`
    ];

    static flags = {
        help: flags.help({char: 'h'}),
        source: flags.string({
            char: 's',
            description: 'Set the project root directory',
            default: process.cwd()
        }),
        destination: flags.string({
            char: 'd',
            description: 'Set the build distribution output folder.'
        }),
        npmCache: flags.string({
            description: 'Path to a directory. Overrides the global npm cache for the npm install step.'
        }),
        buildVersion: flags.string({
            char: 'b',
            description: 'Set the project build version.'
        })
    };

    static args = [];

    async run() {
        const {flags} = this.parse(Build);
        const pkg = await readPkg();
        const destination = join('dist', ['service', flags.buildVersion || pkg.version].join('.'));
        const options = defaults(flags, {
            buildVersion: pkg.version,
            destination,
            npmCache: null
        });

        await buildService(options);
    }
}
