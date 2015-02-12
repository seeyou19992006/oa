function transData(a, idStr, pidStr, chindrenStr,textStr){
  var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr,text = textStr, i = 0, j = 0,k=0, len = a.length;
  for(; i < len; i++){
    hash[a[i][id]] = a[i];
  }
  for(; j < len; j++){
    var aVal = a[j], hashVP = hash[aVal[pid]];
    aVal.text = aVal[text];
    aVal.expanded = true;
    if(hashVP){
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(aVal);
    }else{
      r.push(aVal);
    }
  }
  return r;
}
