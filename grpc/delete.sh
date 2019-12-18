#!/bin/bash
ls  | grep -e 'datasource[0-9]\.json' | xargs rm
ls  | grep -e 'datasource[0-9][0-9]\.json' | xargs rm
ls  | grep -e 'log_server_[0-9]\.txt' | xargs rm  
ls  | grep -e 'log_server_[0-9][0-9]\.txt' | xargs rm
# ls  | grep -e 'offSets_....\.json' | xargs rm

