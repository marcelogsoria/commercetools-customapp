import { actions as sdkActions } from "@commercetools-frontend/sdk";
import { MC_API_PROXY_TARGETS } from "@commercetools-frontend/constants";

const fetchStatesData = () =>
  sdkActions.get({
    mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
    service: "states",
    options: {},
  });

export default fetchStatesData;
