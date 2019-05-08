document.addEventListener('DOMContentLoaded',function(){
    /*-------------------kakao_map----------------------*/
let kakao_map=document.getElementById('map'),
    mapOption={
        center:new daum.maps.LatLng(37.566826005485716, 126.9786567859313),
        level: 3
    };
let map=new daum.maps.Map(kakao_map,mapOption),
    geocoder=new daum.maps.services.Geocoder(),
    marker = new daum.maps.Marker();
    /*--------------------------------------*/
    const gps_btn=document.getElementById('gps'),
          search_text=document.getElementById('search_text'),
          pointer_input_box = document.getElementById('pointer_input'),
          search_btn=document.getElementById('search_btn'),
          search_list=document.querySelector('#search_list');
    let radio_value="address",
        gps_option={
            enableHighAccuracy:true,
            timeout:27000,
            maximumAge:0
        };
    /*------------------gps_btn_event------------------*/
    gps_btn.addEventListener('click',function(e){
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(function(gps_position){
            let coord = new daum.maps.LatLng(gps_position.coords.latitude,gps_position.coords.longitude);
            marker.setMap(null);
            marker=new daum.maps.Marker({
                map: map,
                position: coord
            });
            map.setCenter(coord);
            geocoder.coord2Address(coord.getLng(),coord.getLat(),function(result, status){
                search_list.innerHTML='';
                    if (status===daum.maps.services.Status.OK){
                        if(result[0].road_address){
                            search_list.innerHTML+='<a href="#">'+result[0].road_address.address_name+'</a>';
                        }else if(result[0].address){
                            search_list.innerHTML+='<a href="#">'+result[0].address.address_name+'</a>';
                        }
                        search_list.innerHTML+='<p>위도 : '+gps_position.coords.latitude+'</p>';
                        search_list.innerHTML+='<p>경도 : '+gps_position.coords.longitude+'</p>';
                        let search_list_link = document.querySelector('#search_list a');
                        search_list_link.addEventListener('click',function(e){
                            e.preventDefault();
                            let coords=new daum.maps.LatLng(gps_position.coords.latitude,gps_position.coords.longitude);
                            map.setCenter(coords);
                        },false);
                    }else if(status===daum.maps.services.Status.ZERO_RESULT){
                        alert('검색결과가 없습니다.');
                        search_list.innerHTML='<p>검색 결과 없음</p>';
                    }else if(status===daum.maps.services.Status.ERROR){
                        alert('daum maps services Status error')
                    }
            });
        },function(gps_err){
            alert("ERROR ("+gps_err.code+") "+gps_err.message);
        },gps_option);
    },false);
    /*--------------search_function------------*/
    let search_function=function(){
        let search_value = search_text.value;
        if(!search_value){
            alert("검색어를 입력하세요.");
            return;
        }
        geocoder.addressSearch(search_value,function(result, status){
            let search_list_link = document.querySelectorAll('#search_list a');
                search_list.innerHTML="";
            if (status===daum.maps.services.Status.OK){
                let search_list_html="";
                let search_bool = false;
                let search_num;
                let search_for = function(){
                    for(let i=0; i<result.length; i++){
                        if(result[i].address.zip_code){
                            search_list_html+='<a href="#">'+result[i].address_name+'</a>';
                            search_list_html+='<p>위도 : '+result[i].y+'</p>';
                            search_list_html+='<p>경도 : '+result[i].x+'</p>';
                            search_bool = true;
                            search_num=i;
                            return;
                        }
                    }
                }
                search_for();
                if(search_bool){
                    search_list.innerHTML=search_list_html;
                    map.setCenter(new daum.maps.LatLng(result[search_num].y,result[search_num].x));
                    marker.setMap(null);
                    marker=new daum.maps.Marker({
                        map:map,
                        position:new daum.maps.LatLng(result[search_num].y,result[search_num].x)
                    });
                }
                const search_list_function_clink=function(i){
                    let coords=new daum.maps.LatLng(result[i].y,result[i].x);
                    map.setCenter(coords);
                }
                
                search_list_link = document.querySelectorAll('#search_list a');
                
                for(let i=0; i<search_list_link.length; i++){
                    (function(i){
                        search_list_link[i].addEventListener('click',function(){
                            search_list_function_clink(i);
                        },false);
                        search_list_link[i].addEventListener('click',function(e){e.preventDefault();},false);
                    }(i));
                }
            }else if(status===daum.maps.services.Status.ZERO_RESULT){
                marker.setMap(null);
                alert('검색결과가 없습니다.');
                search_list.innerHTML='<p>검색 결과 없음</p>';
            }else if(status===daum.maps.services.Status.ERROR){
                alert(status+' ERROR!!');
            }
        });
    }
    /*----------latitude and longitude search--------------*/
    const pointer_input_latitude=pointer_input_box.querySelector('.latitude'),
          pointer_input_longitude=pointer_input_box.querySelector('.longitude');
    let pointer_function = function(){
        let latitude_num = pointer_input_latitude.value,
            longitude_num = pointer_input_longitude.value;
        if(!latitude_num||!longitude_num){
            alert("값을 입력하세요.")
            return;
        }
        latitude_num = Number(latitude_num);
        longitude_num = Number(longitude_num);
            let coord = new daum.maps.LatLng(latitude_num,longitude_num);
            geocoder.coord2Address(coord.getLng(),coord.getLat(),function(result, status){
                search_list.innerHTML='';
                marker.setMap(null);
                marker=new daum.maps.Marker({
                    map: map,
                    position: coord
                });
                map.setCenter(coord);
                console.log(result)
                if (status===daum.maps.services.Status.OK){
                    if(result[0].road_address){
                        search_list.innerHTML+='<a href="#">'+result[0].road_address.address_name+'</a>';
                    }else if(result[0].address){
                        search_list.innerHTML+='<a href="#">'+result[0].address.address_name+'</a>';
                    }
                    search_list.innerHTML+='<p>위도 : '+latitude_num+'</p>';
                    search_list.innerHTML+='<p>경도 : '+longitude_num+'</p>';
                    let search_list_link = document.querySelector('#search_list a');
                    search_list_link.addEventListener('click',function(e){
                        e.preventDefault();
                        let coords=new daum.maps.LatLng(latitude_num,longitude_num);
                        map.setCenter(coords);
                    },false);
                }else if(status===daum.maps.services.Status.ZERO_RESULT){
                    alert('검색결과가 없습니다.');
                    search_list.innerHTML='<p>검색 결과 없음</p>';
                    search_list.innerHTML+='<p>위도 : '+latitude_num+'</p>';
                    search_list.innerHTML+='<p>경도 : '+longitude_num+'</p>';
                }else if(status===daum.maps.services.Status.ERROR){
                    alert(status+' ERROR!!');
                }
            });
    }
    /*-----------search_btn_evetn--------------*/
    search_btn.addEventListener('click',function(e){
        e.preventDefault();
        if(radio_value=="address"){
            search_function();
        }else if(radio_value=="pointer"){
            pointer_function();
        }
    },false);
    search_text.addEventListener('keydown',function(e){
        if(e.keyCode==13){
            if(radio_value=="address"){
                search_function();
            }
        }
    },false);
    pointer_input_latitude.addEventListener('keydown',function(e){
        if(e.keyCode==13){
            if(radio_value=="pointer"){
                pointer_function();
            }
        }
    },false);
    pointer_input_longitude.addEventListener('keydown',function(e){
        if(e.keyCode==13){
            if(radio_value=="pointer"){
                pointer_function();
            }
        }
    },false);
    /*---------------resize_evetn---------------*/
    const section_ele=document.querySelector('section'),
          body_ele=document.body;
    let resize_function = function(){
        if(body_ele.clientWidth>700){
            section_ele.style.height=(innerHeight-120)+"px";
        }else{
            section_ele.style.height=(innerHeight-170)+"px";
        }
        map.relayout();
    }
    resize_function();
    window.addEventListener('resize',resize_function,false);
    /*---------------input_radio_type_evetn----------------*/
    const radio_checked = document.querySelectorAll('.radio_box input[type="radio"]');
    for(let i=0; i<radio_checked.length; i++){
        (function(i){
            radio_checked[i].addEventListener('input',function(e){
                if(e.target.value=="address"){
                    radio_value=e.target.value;
                    search_text.style.display='block';
                    pointer_input_box.style.display='none';
                }else if(e.target.value=="pointer"){
                    radio_value=e.target.value;
                    search_text.style.display='none';
                    pointer_input_box.style.display='block';
                }
            },false)
        }(i));
    }
})
