"""Eastwind: Free price + all territories. Run: cd landed/.credentials && PYTHONPATH=. python3 ~/workspace/eastwind/store/asc_finish.py"""
import asc, json
APP='6809286044'
pts=asc.api('GET',f'/v1/apps/{APP}/appPricePoints?filter[territory]=USA&limit=5&fields[appPricePoints]=customerPrice')['data']
free=next(p for p in pts if float(p['attributes']['customerPrice'])==0)
r=asc.api('POST','/v1/appPriceSchedules',{'data':{'type':'appPriceSchedules','relationships':{'app':{'data':{'type':'apps','id':APP}},'baseTerritory':{'data':{'type':'territories','id':'USA'}},'manualPrices':{'data':[{'type':'appPrices','id':'${price1}'}]}}},'included':[{'type':'appPrices','id':'${price1}','attributes':{'startDate':None},'relationships':{'appPricePoint':{'data':{'type':'appPricePoints','id':free['id']}}}}]})
print('price Free', 'ok' if 'data' in r else json.dumps(r)[:200])
terr=[t['id'] for t in asc.api('GET','/v1/territories?limit=200')['data']]
rel=[{'type':'territoryAvailabilities','id':f'${{t{i}}}'} for i,_ in enumerate(terr)]
inc=[{'type':'territoryAvailabilities','id':f'${{t{i}}}','attributes':{'available':True},'relationships':{'territory':{'data':{'type':'territories','id':t}}}} for i,t in enumerate(terr)]
r=asc.api('POST','/v2/appAvailabilities',{'data':{'type':'appAvailabilities','attributes':{'availableInNewTerritories':True},'relationships':{'app':{'data':{'type':'apps','id':APP}},'territoryAvailabilities':{'data':rel}}},'included':inc})
print('availability', 'ok %d'%len(terr) if 'data' in r else json.dumps(r)[:200])
