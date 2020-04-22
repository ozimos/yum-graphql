import { exec } from 'child_process';
import { debuglog } from 'util';

const log = debuglog('app');
const query = `psql ${process.env.DATABASE_URL} -f database/init.sql`;
exec(query, (err, stdout) => {
    if (err) {
        log(`exec error: ${err}`);
        return;
    }
    log(stdout);
});
