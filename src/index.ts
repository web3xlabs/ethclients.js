require("module-alias/register");
import BaseClient from "@ethclients/driver";
import BSCClient from "@ethclients/drivers/bsc";
import KucoinClient from "@ethclients/drivers/kcc";
import CronosClient from "@ethclients/drivers/cronos";
import ETHClient from "@ethclients/drivers/eth";
import AvaxClient from "@ethclients/drivers/avax";
import utils from '@ethclients/utils';

export {
    BaseClient,
    BSCClient,
    KucoinClient,
    CronosClient,
    ETHClient,
    AvaxClient,
    utils
};
